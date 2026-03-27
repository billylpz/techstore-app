import { Component, inject, OnInit } from '@angular/core';
import { User } from '../../../users/interfaces/user.interface';
import { rxResource } from '@angular/core/rxjs-interop';
import { delay, catchError, of } from 'rxjs';
import Swal from 'sweetalert2';
import { PaginatorService } from '../../../shared/components/paginator/paginator.service';
import { UserService } from '../../../users/services/user.service';
import { PaginatorComponent } from "../../../shared/components/paginator/paginator.component";
import { UsersTableComponent } from "../../../users/components/users-table/users-table.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-users-admin-page',
  templateUrl: './users-admin-page.component.html',
  styleUrls: ['./users-admin-page.component.css'],
  imports: [PaginatorComponent, UsersTableComponent,RouterLink]
})
export class UsersAdminPageComponent {
  private service = inject(UserService);
  paginatorService = inject(PaginatorService);

  usersResource = rxResource({
    params: () => ({ page: this.paginatorService.currentPage() - 1 }),
    stream: ({ params }) => {
      let page = params.page;
      return this.service.findAll({ page: page }).pipe(
        delay(500),
        catchError(e => of(console.log(e)))
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
