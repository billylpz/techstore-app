import { PaginatorService } from './../../../shared/components/paginator/paginator.service';
import { Component, computed, EventEmitter, inject, OnInit } from '@angular/core';
import { ProductsTableComponent } from '../../../products/components/products-table/products-table.component';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, catchError, of, delay } from 'rxjs';
import { ProductService } from '../../../products/service/product.service';
import { PaginatorComponent } from '../../../shared/components/paginator/paginator.component';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { Product } from '../../../products/interfaces/product.interface';

@Component({
  selector: 'app-products-admin-page',
  templateUrl: './products-admin-page.component.html',
  styleUrls: ['./products-admin-page.component.css'],
  imports: [ProductsTableComponent, PaginatorComponent, RouterLink]
})
export class ProductsAdminPageComponent {

  private service = inject(ProductService);
  paginatorService = inject(PaginatorService);

  productsResource = rxResource({
    params: () => ({ page: this.paginatorService.currentPage() - 1 }),
    stream: ({ params }) => {
      let page = params.page;
      return this.service.findAll({ page: page }).pipe(
        delay(500),
        catchError(e => of(console.log(e)))
      );
    }
  });


  eliminarProducto(product: Product) {
    const isActive= product.active;
    let text = isActive ? 'deshabilitar' : 'habilitar';
    const request= isActive ?  this.service.delete(product.id!) :  this.service.activate(product.id!);

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
          next:()=>{
            Swal.fire({
              title: "Aviso!",
              text: `Producto ${isActive ? 'deshabilitado':'habilitado'}!`,
              icon: "success"
            });
            this.productsResource.reload();
          },
          error:(e)=>console.log(e.error)
        });
      }
    });
  }

}
