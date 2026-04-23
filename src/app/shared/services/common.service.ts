import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BaseEntity } from '../interfaces/base-entity.interface';
import { HttpClient } from '@angular/common/http';
import { delay, Observable, of, tap } from 'rxjs';
import { PageResponse } from '../interfaces/page-response.interface';

export interface PageOptions {
  page?: number;
  size?: number;
}

export interface SearchByOptions extends PageOptions {
  term?: string,
  name?: string,
  activeSelection?: string,
}


export class CommonService<E extends BaseEntity> {
  protected urlBase;
  protected http = inject(HttpClient);
  protected urlPath;

  constructor(urlPath: string) {
    this.urlBase = `${environment.API_URL}${urlPath}`;
    this.urlPath = urlPath;
  }


  findAll(options: PageOptions): Observable<PageResponse<E>> {
    const { page = 0, size = 5 } = options;

    return this.http.get<PageResponse<E>>(this.urlBase, { params: { page, size } });
  }

  findAllByFilters(options: SearchByOptions): Observable<PageResponse<E>> {
    const { page = 0, size = 10, name = '', activeSelection = '1' } = options;

    return this.http.get<PageResponse<E>>(`${this.urlBase}/by-filters`, {
      params: {
        page, size, name: name.trim(), activeSelection
      }
    });
  }

  findAllActive(options: SearchByOptions): Observable<PageResponse<E>> {
    const { page = 0, size = 10 } = options;

    return this.http.get<PageResponse<E>>(`${this.urlBase}/active`, { params: { page, size } });
  }

  findById(id: number | null): Observable<E | null> {
    if (!id) {
      return of(null);
    }
    return this.http.get<E>(`${this.urlBase}/${id}`);
  }

  save(entity: E): Observable<E> {
    return this.http.post<E>(this.urlBase, entity);
  }

  update(entity: E): Observable<E> {
    return this.http.put<E>(`${this.urlBase}/${entity.id}`, entity);
  }

  activate(id: number): Observable<any> {
    return this.http.patch<any>(`${this.urlBase}/${id}/activate`, null);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlBase}/${id}`);
  }


}
