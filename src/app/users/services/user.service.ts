import { Injectable } from '@angular/core';
import { CommonService, PageOptions, SearchByOptions } from '../../shared/services/common.service';
import { User } from '../interfaces/user.interface';
import { PageResponse } from '../../shared/interfaces/page-response.interface';
import { Observable } from 'rxjs';
import { PasswordChangeRequest } from '../interfaces/password-change-request.interface';


@Injectable({
  providedIn: 'root'
})
export class UserService extends CommonService<User> {
  constructor() {
    super("/api/users")
  }


  findAllByNameOrLastname(options: SearchByOptions): Observable<PageResponse<User>> {
    const { page = 0, size = 3, term = '' } = options;

    return this.http.get<PageResponse<User>>(`${this.urlApi}/by-term`, {
      params: {
        page, size, term
      }
    })
  }

  override findAll(options: PageOptions): Observable<PageResponse<User>> {
    const { page = 0, size = 10 } = options;
    return this.http.get<PageResponse<User>>(this.urlApi, {
      params: {
        page, size
      }
    });
  }

  changePassword(request: PasswordChangeRequest): Observable<void> {
    return this.http.patch<void>(`${this.urlApi}/change-password`,request);
  }
}
