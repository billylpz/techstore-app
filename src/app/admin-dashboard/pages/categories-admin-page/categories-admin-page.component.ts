import { Component, effect, inject, OnInit } from '@angular/core';
import { CategoryService } from '../../../categories/services/category.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { delay, catchError, of } from 'rxjs';
import Swal from 'sweetalert2';
import { Category } from '../../../categories/interfaces/category.interface';
import { PaginatorService } from '../../../shared/components/paginator/paginator.service';
import { CategoriesTableComponent } from "../../../categories/categories-table/categories-table.component";
import { PaginatorComponent } from "../../../shared/components/paginator/paginator.component";
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-categories-admin-page',
  templateUrl: './categories-admin-page.component.html',
  styleUrls: ['./categories-admin-page.component.css'],
  imports: [CategoriesTableComponent, PaginatorComponent, RouterLink]
})
export class CategoriesAdminPageComponent {
  private service = inject(CategoryService);
  paginatorService = inject(PaginatorService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  errorEffect = effect(() => {
    const error = this.categoriesResource.error();
    if (error) {
      Swal.fire("Error de Red", String(error), "error");
    }
  });

  effects = effect(() => {
    const resource = this.categoriesResource.value();
    if (resource && resource.totalPages < this.paginatorService.currentPage()) {
      this.paginatorService.reset();
    }
  });

  categoriesResource = rxResource({
    params: () => ({ page: this.paginatorService.currentPage() - 1 }),
    stream: ({ params }) => {
      let page = params.page;
      return this.service.findAll({ page: page }).pipe(
        delay(500),
      );
    }
  });


  eliminarCategoria(categoria: Category) {
    const isActive = categoria.active;
    let text = isActive ? 'deshabilitar' : 'habilitar';
    const request = isActive ? this.service.delete(categoria.id!) : this.service.activate(categoria.id!);

    Swal.fire({
      title: "Advertencia",
      text: `Estas seguro de ${text} esta categoria?`,
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
              text: `Categoria ${isActive ? 'deshabilitado' : 'habilitado'}!`,
              icon: "success"
            });
            this.categoriesResource.reload();
          },
          error: (message) => Swal.fire("Alerta", message, "warning")
        });
      }
    });
  }

}
