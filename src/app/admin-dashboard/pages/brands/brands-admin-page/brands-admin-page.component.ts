import { Component, inject, DestroyRef, signal, effect } from "@angular/core";
import { rxResource, takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { RouterLink } from "@angular/router";
import { delay } from "rxjs";
import Swal from "sweetalert2";
import { BrandsTableComponent } from "../../../../brands/components/brands-table/brands-table.component";
import { Brand } from "../../../../brands/interfaces/brand.interface";
import { BrandService } from "../../../../brands/services/brand.service";
import { PaginatorComponent } from "../../../../shared/components/paginator/paginator.component";
import { PaginatorService } from "../../../../shared/components/paginator/paginator.service";
import { AdminFilterBarComponent } from "../../../components/admin-filter-bar/admin-filter-bar.component";


@Component({
  selector: 'app-brands-admin-page',
  templateUrl: './brands-admin-page.component.html',
  styleUrls: ['./brands-admin-page.component.css'],
  imports: [PaginatorComponent, BrandsTableComponent, RouterLink, AdminFilterBarComponent]
})
export class BrandsAdminPageComponent {
  private destroyRef = inject(DestroyRef);
  private service = inject(BrandService);
  private paginatorService = inject(PaginatorService);
  searchByNameResult = signal<string>('');
  filterSelection = signal<string>('1');

  effects = effect(() => {
    const resource = this.brandsResource.value();
    if (resource && resource.totalPages < this.paginatorService.currentPage()) {
      this.paginatorService.reset();
    }
  });

  brandsResource = rxResource({
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
        request.pipe(
          takeUntilDestroyed(this.destroyRef)
        )
          .subscribe({
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
