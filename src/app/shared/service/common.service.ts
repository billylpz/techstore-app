import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BaseEntity } from '../interfaces/base-entity.interface';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, delay, Observable, of, tap, throwError } from 'rxjs';
import { PageResponse } from '../interfaces/page-response.interface';

export interface PageOptions {
  page?: number;
  size?: number;
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
      catchError(e => this.handleErrorMessage(e))
    );
  }

  findAllActive(options: PageOptions): Observable<PageResponse<E>> {
    const { page = 0, size = 10 } = options;
    const key = `cache-${this.apiPath}-${page}-${size}-active`;

    if (sessionStorage.getItem(key)) {
      const response = JSON.parse(sessionStorage.getItem(key) || "{}");
      if (response.content != null && response.content.length > 0) {
        return of(response).pipe(delay(300));
      }
    }

    return this.http.get<PageResponse<E>>(`${this.urlApi}/active`, {
      params: {
        page, size
      }
    }).pipe(
      tap(response => {
        sessionStorage.setItem(key, JSON.stringify(response))
      }),
      catchError(e => this.handleErrorMessage(e))
    );
  }

  findById(id: number | null): Observable<E | null> {
    if (!id) {
      return of(null);
    }
    return this.http.get<E>(`${this.urlApi}/${id}`).pipe(
      catchError(e => this.handleErrorMessage(e))
    );
  }

  save(entity: E): Observable<E> {
    return this.http.post<E>(this.urlApi, entity).pipe(
      tap(() => this.clearCache()),
      catchError(e => this.handleErrorMessage(e))
    );
  }

  update(entity: E): Observable<E> {
    return this.http.put<E>(`${this.urlApi}/${entity.id}`, entity).pipe(
      tap(() => this.clearCache()),
      catchError(e => this.handleErrorMessage(e))
    );
  }

  activate(id: number): Observable<any> {
    return this.http.patch<any>(`${this.urlApi}/${id}/activate`, null).pipe(
      tap(() => this.clearCache()),
      catchError(e => this.handleErrorMessage(e))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlApi}/${id}`).pipe(
      tap(() => this.clearCache()),
      catchError(e => this.handleErrorMessage(e))
    );
  }

  //---------helpers

  //elimina la caché de un recurso cuando se hace un save/update/delete de la entidad correspondiente
  protected clearCache(): void {
    Object.keys(sessionStorage).filter(key => key.startsWith(`cache-${this.apiPath}`))
      .forEach(key => sessionStorage.removeItem(key));
    console.log("cache borrada");
  }

  //extrae el message del objeto error del backend y lo devuelve como string envuelto en throw()
  protected handleErrorMessage(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error inesperado!';

    if (error.status === 400) {
      const errorBody = error.error;

      // Caso A: Es el mapa de errores de validación de campos (BindingResult)
      if (typeof errorBody === 'object' && !errorBody.message) {
        // Extraemos los valores del objeto y los unimos con saltos de línea
        errorMessage = JSON.stringify(errorBody);
      }
      // Caso B: Es tu excepción personalizada (DuplicateEntityException)
      else {
        errorMessage = errorBody?.message || errorMessage;
      }
    }
    else {
      errorMessage = error.error.message;
    }

    return throwError(() => errorMessage);
  }
}
