import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LoginRequest } from '../interfaces/login-request';
import { Observable, tap } from 'rxjs';
import { TokenService } from '../jwt/token.service';
import { RegisterRequest } from '../interfaces/register-request';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private urlBase = `${environment.API_URL}/auth`
  private tokenService = inject(TokenService);

  login(request: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.urlBase}/login`, request).pipe(
      tap(res => this.tokenService.save(res.token)),
    );
  }

  register(request: RegisterRequest): Observable<any> {
    return this.http.post<any>(`${this.urlBase}/register`, request);
  }

}
