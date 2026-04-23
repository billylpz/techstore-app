import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { PageResponse } from '../../shared/interfaces/page-response.interface';
import { Order } from '../interfaces/order.interface';
import { PageOptions } from '../../shared/services/common.service';
import { delay, Observable, of, tap } from 'rxjs';
import { TokenService } from '../../auth/jwt/token.service';

export interface OrderOptions extends PageOptions {
  id?: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private urlBase: string;
  private urlPath: string;
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);

  constructor() {
    this.urlBase = `${environment.API_URL}/api/orders`
    this.urlPath = `/api/orders`
  }

  downloadOrderPdf(orderId: number): Observable<Blob> {
    return this.http.get(`${this.urlBase}/history/pdf/${orderId}`, {
      responseType: 'blob'
    });
  }

  findAllMyOrders(options: PageOptions): Observable<PageResponse<Order>> {
    const { page = 0, size = 3 } = options;
    const key = `cache-${this.urlPath}-${this.tokenService.getId()}-${page}-${size}`;

    if (sessionStorage.getItem(key)) {
      const response = JSON.parse(sessionStorage.getItem(key) || "{}");
      if (response.content != null && response.content.length > 0) {
        return of(response).pipe(delay(300));
      }
    }

    return this.http.get<PageResponse<Order>>(`${this.urlBase}/history`, {
      params: {
        page, size
      }
    }).pipe(
      tap(response => {
        sessionStorage.setItem(key, JSON.stringify(response))
      }),
    );
  }


  findById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.urlBase}/${id}`);
  }


  save(order: Order): Observable<Order> {
    return this.http.post<Order>(this.urlBase, order).pipe(
      tap(() => this.clearCache())
    );
  }


  //elimina la caché de un recurso cuando se hace un save de la entidad correspondiente
  private clearCache(): void {
    Object.keys(sessionStorage).filter(key => key.startsWith(`cache-${this.urlPath}`))
      .forEach(key => sessionStorage.removeItem(key));
  }

}
