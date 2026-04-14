import { Component, inject, DestroyRef, signal } from "@angular/core";
import { takeUntilDestroyed, rxResource } from "@angular/core/rxjs-interop";
import { ReactiveFormsModule, FormControl } from "@angular/forms";
import { RouterLink, Router, ActivatedRoute } from "@angular/router";
import { debounceTime, distinctUntilChanged, delay, tap } from "rxjs";
import Swal from "sweetalert2";
import { TokenService } from "../../../../auth/jwt/token.service";
import { PaginatorComponent } from "../../../../shared/components/paginator/paginator.component";
import { PaginatorService } from "../../../../shared/components/paginator/paginator.service";
import { UsersTableComponent } from "../../../../users/components/users-table/users-table.component";
import { User } from "../../../../users/interfaces/user.interface";
import { UserService } from "../../../../users/services/user.service";


@Component({
  selector: 'app-users-admin-page',
  templateUrl: './users-admin-page.component.html',
  styleUrls: ['./users-admin-page.component.css'],
  imports: [PaginatorComponent, UsersTableComponent, RouterLink, ReactiveFormsModule]
})
export class UsersAdminPageComponent {
  private destroyRef = inject(DestroyRef);
  private service = inject(UserService);
  private paginatorService = inject(PaginatorService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private tokenService = inject(TokenService);
  searchByInput = new FormControl<string>('');
  searchByValue = signal<string>('');

  constructor() {
    this.searchByInput.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.searchByValue.set(value!.trim());

        //reseteamos el param page a 1
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { page: 1 },
          queryParamsHandling: 'merge'
        });
      })
  };

  usersResource = rxResource({
    params: () => ({ page: this.paginatorService.currentPage() - 1, term: this.searchByValue() }),
    stream: ({ params }) => {
      let page = params.page;
      let term = params.term;

      if (term && term.length > 0) {
        return this.service.findAllByNameOrLastname({ page, term }).pipe(
          delay(500)
        );
      }
      return this.service.findAll({ page: page }).pipe(
        delay(500),
        tap(pageContent => {
          pageContent.content = pageContent.content.filter(u => u.id != this.tokenService.getId())
        })
      );
    }
  });


  eliminarUser(user: User) {
    const isActive = user.active;
    let text = isActive ? 'deshabilitar' : 'habilitar';
    const request = isActive ? this.service.delete(user.id!) : this.service.activate(user.id!);

    Swal.fire({
      title: "Advertencia",
      text: `Estas seguro de ${text} este usuario?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: `Sí, ${text}!`
    }).then((result) => {
      if (result.isConfirmed) {
        request.pipe(
          takeUntilDestroyed(this.destroyRef)
        ).subscribe({
          next: () => {
            Swal.fire({
              title: "Aviso!",
              text: `Usuario ${isActive ? 'deshabilitado' : 'habilitado'}!`,
              icon: "success"
            });
            this.usersResource.reload();
          },
        });
      }
    });
  }


}
