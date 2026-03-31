import { PaginatorService } from './../../../shared/components/paginator/paginator.service';
import { Component, computed, DestroyRef, effect, EventEmitter, inject, OnInit, signal } from '@angular/core';
import { ProductsTableComponent } from '../../../products/components/products-table/products-table.component';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, catchError, of, delay, tap, debounceTime, distinctUntilChanged } from 'rxjs';
import { ProductService } from '../../../products/services/product.service';
import { PaginatorComponent } from '../../../shared/components/paginator/paginator.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { Product } from '../../../products/interfaces/product.interface';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-products-admin-page',
  templateUrl: './products-admin-page.component.html',
  styleUrls: ['./products-admin-page.component.css'],
  imports: [ProductsTableComponent, PaginatorComponent, RouterLink, ReactiveFormsModule]
})
export class ProductsAdminPageComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  private service = inject(ProductService);
  paginatorService = inject(PaginatorService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  searchByName = new FormControl('');
  searchResult = signal<string>('');
  filterSelection = signal<string>('1');

  ngOnInit(): void {
    this.searchByName.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => {
      this.searchResult.set(value?.trim() ?? '');

      //reseteamos el param page a 1
      this.paginatorService.reset()

    })
  }

  onFilterChange(value: string) {
    this.filterSelection.set(value);

    // Siempre que filtramos, volvemos a la página 1
    this.paginatorService.reset()
  }

  errorEffect = effect(() => {
    const error = this.productsResource.error();
    if (error) {
      Swal.fire("Error de Red", String(error), "error");
    }
  });

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
      name: this.searchResult()
    }),
    stream: ({ params }) => {
      return this.service.findAllByFilters({
        page: params.page,
        name: params.name,
        activeSelection: params.activeSelection
      }).pipe(
        delay(500),
      );;
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
        request.subscribe({
          next: () => {
            Swal.fire({
              title: "Aviso!",
              text: `Producto ${isActive ? 'deshabilitado' : 'habilitado'}!`,
              icon: "success"
            });
            this.productsResource.reload();
          },
          error: (message) => Swal.fire("Alerta", message, "warning")
        });
      }
    });
  }

}
