import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BaseEntity } from '../interfaces/base-entity.interface';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { PageResponse } from '../interfaces/page-response.interface';

export interface PageOptions {
  page?: number;
  size?: number;
}


export class CommonService<E extends BaseEntity> {
  protected urlApi = environment.API_URL;
  protected http = inject(HttpClient);

  constructor(endpoint: string) {
    this.urlApi = `${environment.API_URL}${endpoint}`;
  }

  findAll(options: PageOptions): Observable<PageResponse<E>> {
    const { page = 0, size = 10 } = options
    return this.http.get<PageResponse<E>>(this.urlApi, {
      params: {
        page, size
      }
    }).pipe(
      catchError(e => this.handleErrorMessage(e))
    );
  }

  findAllActive(options: PageOptions): Observable<PageResponse<E>> {
    const { page = 0, size = 10 } = options
    return this.http.get<PageResponse<E>>(`${this.urlApi}/active`, {
      params: {
        page, size
      }
    }).pipe(
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
      catchError(e => this.handleErrorMessage(e))
    );
  }

  update(entity: E): Observable<E> {
    return this.http.put<E>(`${this.urlApi}/${entity.id}`, entity).pipe(
      catchError(e => this.handleErrorMessage(e))
    );
  }

  activate(id: number): Observable<any> {
    return this.http.patch<any>(`${this.urlApi}/${id}/activate`, null).pipe(
      catchError(e => this.handleErrorMessage(e))
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlApi}/${id}`).pipe(
      catchError(e => this.handleErrorMessage(e))
    );
  }


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
