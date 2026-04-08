import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../../products/services/product.service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-product-details-page',
  templateUrl: './product-details-page.component.html',
  styleUrls: ['./product-details-page.component.css'],
  imports:[DecimalPipe]
})
export class ProductDetailsPageComponent {
  private productService = inject(ProductService);
  private route = inject(ActivatedRoute);

  productId = toSignal(this.route.paramMap.pipe(map(params => {
    let id = params.get('id') ?? '1';
    let numericId = Number.parseInt(id);

    if(isNaN(numericId) || numericId<=0){
      numericId= 1
    }

    return numericId;
  })));

  productResource = rxResource({
    params: () => ({ id: this.productId() }),
    stream: ({ params }) => {
      let id = params.id;
      return this.productService.findById(id ?? 1);
    }
  });

}
