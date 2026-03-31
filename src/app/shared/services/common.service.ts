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
  protected urlApi;
  protected http = inject(HttpClient);
  protected apiPath;

  constructor(endpoint: string) {
    this.urlApi = `${environment.API_URL}${endpoint}`;
    this.apiPath = endpoint;
  }


  findAll(options: PageOptions): Observable<PageResponse<E>> {
    const { page = 0, size = 5 } = options;
    const key = `cache-${this.apiPath}-${page}-${size}`;

    if (sessionStorage.getItem(key)) {
      const response = JSON.parse(sessionStorage.getItem(key) || "{}");
      if (response.content != null && response.content.length > 0) {
        return of(response).pipe(delay(300));
      }
    }

    return this.http.get<PageResponse<E>>(this.urlApi, {
      params: {
        page, size
      }
    }).pipe(
      tap(response => {
        sessionStorage.setItem(key, JSON.stringify(response))
      }),
    );
  }

  findAllByFilters(options: SearchByOptions): Observable<PageResponse<E>> {
    const { page = 0, size = 10, name = '', activeSelection = '1' } = options;
    const key = `cache-${this.apiPath}-${page}-${size}-filter:${name}-${activeSelection}`;

    if (sessionStorage.getItem(key)) {
      const response = JSON.parse(sessionStorage.getItem(key) || "{}");
      if (response.content != null && response.content.length > 0) {
        return of(response).pipe(delay(300));
      }
    }

    return this.http.get<PageResponse<E>>(`${this.urlApi}/by-filters`, {
      params: {
        page, size, name, activeSelection
      }
    }).pipe(
      tap(response => {
        sessionStorage.setItem(key, JSON.stringify(response))
      }),
    );
  }

  findById(id: number | null): Observable<E | null> {
    if (!id) {
      return of(null);
    }
    return this.http.get<E>(`${this.urlApi}/${id}`).pipe(
    );
  }

  save(entity: E): Observable<E> {
    return this.http.post<E>(this.urlApi, entity).pipe(
      tap(() => this.clearCache()),
    );
  }

  update(entity: E): Observable<E> {
    return this.http.put<E>(`${this.urlApi}/${entity.id}`, entity).pipe(
      tap(() => this.clearCache()),
    );
  }

  activate(id: number): Observable<any> {
    return this.http.patch<any>(`${this.urlApi}/${id}/activate`, null).pipe(
      tap(() => this.clearCache()),
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlApi}/${id}`).pipe(
      tap(() => this.clearCache())
    );
  }

  //---------helpers

  //elimina la caché de un recurso cuando se hace un save/update/delete de la entidad correspondiente
  protected clearCache(): void {
    Object.keys(sessionStorage).filter(key => key.startsWith(`cache-${this.apiPath}`))
      .forEach(key => sessionStorage.removeItem(key));
  }


}
