import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BaseEntity } from '../interfaces/base-entity.interface';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { PageResponse } from '../interfaces/page-response.interface';

interface Options {
  page?: number;
  size?: number;
}


export class CommonService<E extends BaseEntity> {
  protected urlApi = environment.API_URL;
  protected http = inject(HttpClient);

  constructor(endpoint: string) {
    this.urlApi = `${environment.API_URL}${endpoint}`;
  }

  findAll(options: Options): Observable<PageResponse<E>> {
    const { page = 0, size = 10 } = options
    return this.http.get<PageResponse<E>>(this.urlApi, {
      params: {
        page, size
      }
    });
  }

  findAllActive(options: Options): Observable<PageResponse<E>> {
    const { page = 0, size = 10 } = options
    return this.http.get<PageResponse<E>>(`${this.urlApi}/active`, {
      params: {
        page, size
      }
    });
  }

  findById(id: number | null): Observable<E | null> {
    if(!id){
      return of(null);
    }
    return this.http.get<E>(`${this.urlApi}/${id}`);
  }

  save(entity: E): Observable<E> {
    return this.http.post<E>(this.urlApi, entity);
  }

  update(entity: E): Observable<E> {
    return this.http.put<E>(`${this.urlApi}/${entity.id}`, entity);
  }
  
  activate(id:number): Observable<any> {
    return this.http.patch<any>(`${this.urlApi}/${id}/activate`,null);
  }

  delete(id:number):Observable<void>{
    return this.http.delete<void>(`${this.urlApi}/${id}`);
  }

}
