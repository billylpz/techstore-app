import { Component, input} from '@angular/core';
import { Product } from '../../interfaces/product.interface';
import { RouterLink } from "@angular/router";
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
  imports: [RouterLink,DecimalPipe]
})
export class ProductCardComponent {
  product= input<Product>();
  

}
