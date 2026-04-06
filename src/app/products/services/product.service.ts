import { Product } from '../interfaces/product.interface';
import { Injectable } from '@angular/core';
import { CommonService, PageOptions, SearchByOptions } from '../../shared/services/common.service';
import { delay, Observable, of, tap } from 'rxjs';
import { PageResponse } from '../../shared/interfaces/page-response.interface';



@Injectable({
  providedIn: 'root'
})
export class ProductService extends CommonService<Product> {
  constructor() {
    super("/api/products")
  }

  findAllByNameOnlyActive(options: SearchByOptions): Observable<PageResponse<Product>> {
    const { page = 0, size = 5 ,name='' } = options;

    return this.http.get<PageResponse<Product>>(`${this.urlApi}/by-name-active`, {
      params: {page, size, name}
    });
  }



  saveWithImages(product: Product, files: File[]): Observable<Product> {
    const formData = this.buildFormData(product, files);

    return this.http.post<Product>(`${this.urlApi}/with-images`, formData).pipe(
      tap(() => this.clearCache()),
    );
  }


  updateWithImages(product: Product, files: File[]): Observable<Product> {
    const formData = this.buildFormData(product, files);

    return this.http.put<Product>(`${this.urlApi}/with-images/${product.id}`, formData).pipe(
      tap(() => this.clearCache()),
    );
  }


  deleteProductImage(publicId: string): Observable<void> {
    return this.http.delete<void>(`${this.urlApi}/product-image`, { params: { publicId } }).pipe(
      tap(() => this.clearCache()),
    );
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
