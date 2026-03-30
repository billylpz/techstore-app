import { Component, effect, inject, signal } from '@angular/core';
import { User } from '../../../users/interfaces/user.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { delay, catchError, of, debounceTime, distinctUntilChanged, tap, EMPTY } from 'rxjs';
import Swal from 'sweetalert2';
import { PaginatorService } from '../../../shared/components/paginator/paginator.service';
import { UserService } from '../../../users/services/user.service';
import { PaginatorComponent } from "../../../shared/components/paginator/paginator.component";
import { UsersTableComponent } from "../../../users/components/users-table/users-table.component";
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-users-admin-page',
  templateUrl: './users-admin-page.component.html',
  styleUrls: ['./users-admin-page.component.css'],
  imports: [PaginatorComponent, UsersTableComponent, RouterLink, ReactiveFormsModule]
})
export class UsersAdminPageComponent {
  private service = inject(UserService);
  paginatorService = inject(PaginatorService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  searchByInput = new FormControl<string>('');
  searchByValue = signal<string>('');

  constructor() {
    this.searchByInput.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged())
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

  effects = effect(() => {
    const error = this.usersResource.error();
    if (error) {
      Swal.fire("Error de Red", String(error), "error");
    }
  });

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
        delay(500)
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
        request.subscribe({
          next: () => {
            Swal.fire({
              title: "Aviso!",
              text: `Usuario ${isActive ? 'deshabilitado' : 'habilitado'}!`,
              icon: "success"
            });
            this.usersResource.reload();
          },
          error: (message) => Swal.fire("Alerta", message, "warning")
        });
      }
    });
  }


}
