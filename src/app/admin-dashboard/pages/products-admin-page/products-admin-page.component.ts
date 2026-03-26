import { PaginatorService } from './../../../shared/components/paginator/paginator.service';
import { Component, computed, DestroyRef, effect, EventEmitter, inject, OnInit, signal } from '@angular/core';
import { ProductsTableComponent } from '../../../products/components/products-table/products-table.component';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, catchError, of, delay, tap, debounceTime, distinctUntilChanged } from 'rxjs';
import { ProductService } from '../../../products/services/product.service';
import { PaginatorComponent } from '../../../shared/components/paginator/paginator.component';
import { RouterLink } from '@angular/router';
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

  searchByName = new FormControl('');
  searchResult = signal<string | null>('');

  ngOnInit(): void {
    this.searchByName.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => {
      this.searchResult.set(value?.trim() ?? '')
    })
  }

  effects = effect(() => {

  });

  productsResource = rxResource({
    // Cuando 'page' o 'term' (que son señales) cambien, esto se dispara solo
    params: () => ({
      page: this.paginatorService.currentPage() - 1,
      term: this.searchResult()
    }),
    stream: ({ params }) => {
      // Si hay texto en el buscador, llamamos al método de búsqueda
      if (params.term && params.term.length > 0) {
        return this.service.findAllByName({ page: params.page, term: params.term }).pipe(
          delay(500)
        );
      }
      // Si no hay texto, llamamos al findAll normal
      return this.service.findAll({ page: params.page }).pipe(delay(500));
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
