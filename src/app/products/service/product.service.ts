import { Injectable } from '@angular/core';
import { Product } from '../interfaces/product.interface';
import { CommonService, PageOptions } from '../../shared/service/common.service';
import { Observable } from 'rxjs';
import { PageResponse } from '../../shared/interfaces/page-response.interface';

export interface SearchByOptions extends PageOptions {
  term: string
}

@Injectable({
  providedIn: 'root'
})
export class ProductService extends CommonService<Product> {
  constructor() {
    super("/api/products")
  }

  findAllByName(options: SearchByOptions): Observable<PageResponse<Product>> {
    const { term = '', page = 0 } = options;
    return this.http.get<PageResponse<Product>>(`${this.urlApi}/by-term`, { params: { page,term } });
  }
}
