import { Component, inject, input, OnInit, output } from '@angular/core';

import { Product } from '../../interfaces/product.interface';
import { DatePipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import {  ActiveTextEntityPipe } from "../../../shared/pipes/active-text-entity.pipe";
import {ActiveStateColorPipe } from "../../../shared/pipes/active-state-color.pipe";
@Component({
  selector: 'products-table',
  templateUrl: './products-table.component.html',
  styleUrls: ['./products-table.component.css'],
  imports: [DatePipe, RouterLink, NgClass,  ActiveStateColorPipe, ActiveTextEntityPipe]
})
export class ProductsTableComponent {
 products = input.required<Product[] | undefined>();
 onDelete=output<Product>()

 eliminar(product:Product){
  this.onDelete.emit(product);
 }
}
