import { Component, inject, OnInit } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductService } from '../../service/product.service';
import { catchError, map, of } from 'rxjs';
@Component({
  selector: 'products-table',
  templateUrl: './products-table.component.html',
  styleUrls: ['./products-table.component.css']
})
export class ProductsTableComponent {
  private service=inject(ProductService);

  productsResource = rxResource({
    params: () =>({}),
    stream: ()=>{
      return this.service.findAll().pipe(
        map(response=>response.content),
        catchError(e=>of(console.log(e)))
      );
    }
  });
}
