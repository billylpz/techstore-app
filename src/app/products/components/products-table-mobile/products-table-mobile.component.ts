import { Component, input, output } from '@angular/core';
import { Product } from '../../interfaces/product.interface';
import { DecimalPipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ActiveStateColorPipe } from "../../../shared/pipes/active-state-color.pipe";

@Component({
  selector: 'products-table-mobile',
  templateUrl: './products-table-mobile.component.html',
  styleUrls: ['./products-table-mobile.component.css'],
  imports: [DecimalPipe, RouterLink, ActiveStateColorPipe, NgClass]
})
export class ProductsTableMobileComponent {
  products = input.required<Product[] | undefined>();
  onDelete = output<Product>()
  eliminar(product: Product) {
    this.onDelete.emit(product);
  }
}
