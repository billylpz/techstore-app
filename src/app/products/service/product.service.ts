import { Product } from './../interfaces/product.interface';
import { Injectable } from '@angular/core';
import { CommonService, PageOptions } from '../../shared/service/common.service';
import { catchError, delay, Observable, of, tap } from 'rxjs';
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
    const key = `cache-${this.apiPath}-${page}-${term}`;

    if (sessionStorage.getItem(key)) {
      const response = JSON.parse(sessionStorage.getItem(key) || "{}");
      if (response.content != null && response.content.length > 0) {
        return of(response).pipe(delay(300));
      }
    }

    return this.http.get<PageResponse<Product>>(`${this.urlApi}/by-term`, { params: { page, term } }).pipe(
      tap(response => {
        sessionStorage.setItem(key, JSON.stringify(response))
      }),
      catchError(e => this.handleErrorMessage(e))
    );
  }

  saveWithImages(product: Product, files: File[]): Observable<Product> {
    const formData = this.buildFormData(product, files);

    return this.http.post<Product>(`${this.urlApi}/with-images`, formData).pipe(
      tap(() => this.clearCache()),
      catchError(e => this.handleErrorMessage(e))
    );
  }


  updateWithImages(product: Product, files: File[]): Observable<Product> {
    const formData = this.buildFormData(product, files);

    return this.http.put<Product>(`${this.urlApi}/with-images/${product.id}`, formData).pipe(
      tap(() => this.clearCache()),
      catchError(e => this.handleErrorMessage(e))
    );
  }


  deleteProductImage(publicId: string): Observable<void> {
    return this.http.delete<void>(`${this.urlApi}/product-image`, { params: { publicId } }).pipe(
      tap(() => this.clearCache()),
      catchError(e => this.handleErrorMessage(e))
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
