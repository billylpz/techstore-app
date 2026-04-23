import { Product } from '../interfaces/product.interface';
import { Injectable } from '@angular/core';
import { CommonService, SearchByOptions } from '../../shared/services/common.service';
import { Observable, tap } from 'rxjs';
import { PageResponse } from '../../shared/interfaces/page-response.interface';
import { HttpParams } from '@angular/common/http';

export interface SearchProductsOptions extends SearchByOptions {
  categoryId?: string,
  brandId?: string,
  sort?: string,
}

@Injectable({
  providedIn: 'root'
})
export class ProductService extends CommonService<Product> {
  constructor() {
    super("/api/products")
  }

  findAllByFilterOnlyActive(options: SearchProductsOptions): Observable<PageResponse<Product>> {
    let { page = 0, name = '', categoryId = '', brandId = '', sort = '' } = options;

    let params = new HttpParams()
      .append('page', page)
      .append('name', name)
      .append('categoryId', categoryId)
      .append('brandId', brandId)

    if (sort.trim() == 'price,asc' || sort.trim() == 'price,desc') {
      params = params.append('sort', sort);
    }

    if (sort.trim() == 'all'){
      params = params.delete('categoryId');
      params = params.delete('brandId');
    }

      return this.http.get<PageResponse<Product>>(`${this.urlBase}/by-filter-active`, {
        params: params
      });
  }

  saveWithImages(product: Product, files: File[]): Observable<Product> {
    const formData = this.buildFormData(product, files);

    return this.http.post<Product>(`${this.urlBase}/with-images`, formData);
  }


  updateWithImages(product: Product, files: File[]): Observable<Product> {
    const formData = this.buildFormData(product, files);

    return this.http.put<Product>(`${this.urlBase}/with-images/${product.id}`, formData);
  }


  deleteProductImage(publicId: string): Observable<void> {
    return this.http.delete<void>(`${this.urlBase}/product-image`, { params: { publicId } });
  }

  ///helpers
  private buildFormData(product: Product, files: File[]): FormData {
    const formData = new FormData()
    formData.append("name", product.name)
    formData.append("description", product.description)
    formData.append("price", product.price.toString())
    formData.append("stock", product.stock.toString())
    formData.append("category.id", product.category?.id?.toString() || '0')
    formData.append("brand.id", product.brand?.id?.toString() || '0')

    if (files != null && files.length > 0) {
      files.forEach(file => {
        formData.append('files', file);
      });
    }
    return formData;
  }
}
