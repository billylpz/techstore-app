import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LoginRequest } from '../interfaces/login-request';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { TokenService } from './jwt/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.API_URL}/auth`
  private tokenService = inject(TokenService);

  login(request: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, request).pipe(
      tap(res => this.tokenService.save(res.token)),
      catchError(e => this.errorHandler(e))
    );
  }

  errorHandler(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error inesperado!';
    if (error.error && error.status == 500) {
      errorMessage = error.error.message;
    }
    return throwError(() => errorMessage);
  }

}
