import { PaginatorService } from './../../../shared/components/paginator/paginator.service';
import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { ProductsTableComponent } from '../../../products/components/products-table/products-table.component';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { delay } from 'rxjs';
import { ProductService } from '../../../products/services/product.service';
import { PaginatorComponent } from '../../../shared/components/paginator/paginator.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { Product } from '../../../products/interfaces/product.interface';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminFilterBarComponent } from "../../components/admin-filter-bar/admin-filter-bar.component";

@Component({
  selector: 'app-products-admin-page',
  templateUrl: './products-admin-page.component.html',
  styleUrls: ['./products-admin-page.component.css'],
  imports: [ProductsTableComponent, PaginatorComponent, RouterLink, ReactiveFormsModule, AdminFilterBarComponent]
})
export class ProductsAdminPageComponent {
  private destroyRef = inject(DestroyRef);
  private service = inject(ProductService);
  private paginatorService = inject(PaginatorService);
  searchByNameResult = signal<string>('');
  filterSelection = signal<string>('1');

  effects = effect(() => {
    const resource = this.productsResource.value();

    //si el param page es mayor a las paginas del recurso, se reincia el param page a '1'
    if (resource && resource.totalPages! < this.paginatorService.currentPage()) {
      this.paginatorService.reset()
    }
  });


  productsResource = rxResource({
    params: () => ({
      page: this.paginatorService.currentPage() - 1,
      activeSelection: this.filterSelection(),
      name: this.searchByNameResult()
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


  eliminarProducto(product: Product) {
    const isActive = product.active;
    let text = isActive ? 'deshabilitar' : 'habilitar';
    const request = isActive ? this.service.delete(product.id!) : this.service.activate(product.id!);

    Swal.fire({
      title: "Advertencia",
      text: `Estas seguro de ${text} este producto?`,
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
              text: `Producto ${isActive ? 'deshabilitado' : 'habilitado'}!`,
              icon: "success"
            });
            this.productsResource.reload();
          },
        });
      }
    });
  }

}
