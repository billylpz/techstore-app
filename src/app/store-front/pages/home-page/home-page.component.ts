import { Component, inject } from '@angular/core';
import { ProductCardComponent } from "../../../products/components/product-card/product-card.component";
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ProductService } from '../../../products/services/product.service';
import { ActivatedRoute } from '@angular/router';
import { delay, map } from 'rxjs';
import { LoadingDotsComponent } from "../../../shared/components/loading-dots/loading-dots.component";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  imports: [ProductCardComponent, LoadingDotsComponent]
})
export class HomePageComponent {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

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
      name: this.searchByNameResult(),
      brandId: this.searchByBrandResult(),
      categoryId: this.searchByCategoryResult()
    }),
    stream: ({ params }) => {
      let name = params.name;
      let categoryId = params.categoryId;
      let brandId = params.brandId;
      return this.productService.findAllByFilterOnlyActive({ name, categoryId, brandId }).pipe(
        delay(500)
      );
    }
  });

}
