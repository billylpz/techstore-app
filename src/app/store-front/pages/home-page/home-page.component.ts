import { Component, inject } from '@angular/core';
import { ProductCardComponent } from "../../../products/components/product-card/product-card.component";
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductService } from '../../../products/services/product.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
  imports: [ProductCardComponent]
})
export class HomePageComponent {
  productService = inject(ProductService);

  productsResource = rxResource({
    params: () => ({}),
    stream: ({ params }) => {
      return this.productService.findAllActive({});
    }
  });

}
