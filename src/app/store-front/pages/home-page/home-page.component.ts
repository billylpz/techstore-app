import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ProductCardComponent } from "../../../products/components/product-card/product-card.component";
import { rxResource, takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ProductService } from '../../../products/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, distinctUntilChanged, map, takeUntil } from 'rxjs';
import { LoadingDotsComponent } from "../../../shared/components/loading-dots/loading-dots.component";
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PaginatorComponent } from "../../../shared/components/paginator/paginator.component";
import { PaginatorService } from '../../../shared/components/paginator/paginator.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  imports: [ProductCardComponent, LoadingDotsComponent, ReactiveFormsModule, PaginatorComponent]
})
export class HomePageComponent {
  private destoryRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private paginatorService = inject(PaginatorService);
  private sortByPrice = signal<string>('');
  orderBySelect = new FormControl<string>('all');

  constructor() {
    this.orderBySelect.valueChanges.pipe(
      distinctUntilChanged(),
      takeUntilDestroyed(this.destoryRef)
    ).subscribe(value => {
      this.sortByPrice.set(value ?? 'all');

      if (this.sortByPrice().trim() == 'all') {
        this.sortByPrice.set('')
        this.router.navigate([''], {
          relativeTo: this.route,
          queryParams: { page: 1 }
        });
      }
    })
  }

  private searchByNameResult = toSignal(this.route.queryParamMap.pipe(map(param => {
    let name = param.get('name');
    return name != null ? name : '';
  })));

  private searchByCategoryResult = toSignal(this.route.queryParamMap.pipe(map(param => {
    let categoryId = param.get('categoryId');
    return categoryId != null ? categoryId : '';
  })));

  private searchByBrandResult = toSignal(this.route.queryParamMap.pipe(map(param => {
    let brandId = param.get('brandId');
    return brandId != null ? brandId : '';
  })));


  productsResource = rxResource({
    params: () => ({
      page: this.paginatorService.currentPage() - 1,
      name: this.searchByNameResult(),
      brandId: this.searchByBrandResult(),
      categoryId: this.searchByCategoryResult(),
      sort: this.sortByPrice()
    }),
    stream: ({ params }) => {
      let page = params.page;
      let name = params.name;
      let categoryId = params.categoryId;
      let brandId = params.brandId;
      let sort = params.sort;
      return this.productService.findAllByFilterOnlyActive({ page, name, categoryId, brandId, sort }).pipe(
        delay(500)
      );
    }
  });

}
