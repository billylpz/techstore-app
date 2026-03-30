import { Injectable } from '@angular/core';
import { CommonService, PageOptions, SearchByOptions } from '../../shared/services/common.service';
import { User } from '../interfaces/user.interface';
import { PageResponse } from '../../shared/interfaces/page-response.interface';
import { delay, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService extends CommonService<User> {

  constructor() {
    super("/api/users")
  }


   findAllByNameOrLastname(options: SearchByOptions): Observable<PageResponse<User>> {
      const { page = 0, size = 3, term='' } = options;
      const key = `cache-${this.apiPath}-${page}-${size}-${term}`;
  
      if (sessionStorage.getItem(key)) {
        const response = JSON.parse(sessionStorage.getItem(key) || "{}");
        if (response.content != null && response.content.length > 0) {
          return of(response).pipe(delay(300));
        }
      }
  
      return this.http.get<PageResponse<User>>(`${this.urlApi}/by-term`, {
        params: {
          page, size, term
        }
      }).pipe(
        tap(response => {
          sessionStorage.setItem(key, JSON.stringify(response))
        }),
      );
    }
}
