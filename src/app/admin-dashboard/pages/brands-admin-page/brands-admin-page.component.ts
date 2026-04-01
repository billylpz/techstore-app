import { Component, effect, inject, OnInit } from '@angular/core';
import { PaginatorComponent } from "../../../shared/components/paginator/paginator.component";
import { ProductsTableComponent } from "../../../products/components/products-table/products-table.component";
import { BrandsTableComponent } from "../../../brands/components/brands-table/brands-table.component";
import { rxResource } from '@angular/core/rxjs-interop';
import { delay, catchError, of } from 'rxjs';
import { PaginatorService } from '../../../shared/components/paginator/paginator.service';
import { BrandService } from '../../../brands/services/brand.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Brand } from '../../../brands/interfaces/brand.interface';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-brands-admin-page',
  templateUrl: './brands-admin-page.component.html',
  styleUrls: ['./brands-admin-page.component.css'],
  imports: [PaginatorComponent, BrandsTableComponent, RouterLink]
})
export class BrandsAdminPageComponent {

  private service = inject(BrandService);
  paginatorService = inject(PaginatorService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  effects = effect(() => {
    const resource = this.brandsResource.value();
    if (resource && resource.totalPages < this.paginatorService.currentPage()) {
      this.paginatorService.reset();
    }
  });

  brandsResource = rxResource({
    params: () => ({ page: this.paginatorService.currentPage() - 1 }),
    stream: ({ params }) => {
      let page = params.page;

      return this.service.findAll({ page: page }).pipe(
        delay(500),
      );
    }
  });


  eliminarMarca(marca: Brand) {
    const isActive = marca.active;
    let text = isActive ? 'deshabilitar' : 'habilitar';
    const request = isActive ? this.service.delete(marca.id!) : this.service.activate(marca.id!);

    Swal.fire({
      title: "Advertencia",
      text: `Estas seguro de ${text} esta marca?`,
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
              text: `Marca ${isActive ? 'deshabilitada' : 'habilitada'}!`,
              icon: "success"
            });
            this.brandsResource.reload();
          },
        });
      }
    });
  }
}
