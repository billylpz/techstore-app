import {  Injectable } from '@angular/core';
import { Product } from '../interfaces/product.interface';
import { CommonService } from '../../shared/service/common.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends CommonService<Product>{
  constructor(){
    super("/api/products")
  }
}
