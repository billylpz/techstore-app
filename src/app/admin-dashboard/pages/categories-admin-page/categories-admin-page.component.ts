import { Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { CategoryService } from '../../../categories/services/category.service';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { delay, catchError, of } from 'rxjs';
import Swal from 'sweetalert2';
import { Category } from '../../../categories/interfaces/category.interface';
import { PaginatorService } from '../../../shared/components/paginator/paginator.service';
import { CategoriesTableComponent } from "../../../categories/categories-table/categories-table.component";
import { PaginatorComponent } from "../../../shared/components/paginator/paginator.component";
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminFilterBarComponent } from "../../components/admin-filter-bar/admin-filter-bar.component";

@Component({
  selector: 'app-categories-admin-page',
  templateUrl: './categories-admin-page.component.html',
  styleUrls: ['./categories-admin-page.component.css'],
  imports: [CategoriesTableComponent, PaginatorComponent, RouterLink, AdminFilterBarComponent]
})
export class CategoriesAdminPageComponent {
  private destroyRef = inject(DestroyRef);
  private service = inject(CategoryService);
  private paginatorService = inject(PaginatorService);
  searchByNameResult = signal<string>('');
  filterSelection = signal<string>('1');

  effects = effect(() => {
    const resource = this.categoriesResource.value();
    if (resource && resource.totalPages < this.paginatorService.currentPage()) {
      this.paginatorService.reset();
    }
  });

  categoriesResource = rxResource({
    params: () => ({
      page: this.paginatorService.currentPage() - 1,
      name: this.searchByNameResult(),
      activeSelection: this.filterSelection()
    }),
    stream: ({ params }) => {
      return this.service.findAllByFilters({
        page: params.page,
        name: params.name,
        activeSelection: params.activeSelection
      }).pipe(
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
        request.pipe(
          takeUntilDestroyed(this.destroyRef)
        ).subscribe({
          next: () => {
            Swal.fire({
              title: "Aviso!",
              text: `Categoria ${isActive ? 'deshabilitado' : 'habilitado'}!`,
              icon: "success"
            });
            this.categoriesResource.reload();
          },
        });
      }
    });
  }

}
