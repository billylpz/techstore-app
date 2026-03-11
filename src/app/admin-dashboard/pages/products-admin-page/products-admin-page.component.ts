import { Component, OnInit } from '@angular/core';
import { ProductsTableComponent } from '../../../products/components/products-table/products-table.component';

@Component({
  selector: 'app-products-admin-page',
  templateUrl: './products-admin-page.component.html',
  styleUrls: ['./products-admin-page.component.css'],
    imports:[ProductsTableComponent]
})
export class ProductsAdminPageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
