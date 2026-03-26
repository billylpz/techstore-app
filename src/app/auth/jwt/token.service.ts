import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class TokenService {

  save(token: string) {
    sessionStorage.setItem("auth_token", token);
  }

  remove(): void {
    sessionStorage.removeItem("auth_token");
  }

  getToken(): string | null {
    return sessionStorage.getItem("auth_token");
  }

  getPayload(): any | null {
    const token = this.getToken();
    if (!token) return null;
    return jwtDecode(token);
  }

  isAdmin(): boolean {
    if (!this.getPayload()) return false;
    const payload: any = this.getPayload();
    return payload.authorities.includes('ROLE_ADMIN');
  }

  isExpired(): boolean {
    if (!this.getPayload()) return true;
    const exp = this.getPayload().exp;
    const now = Date.now() / 1000;
    return exp < now ? true : false;
  }

  getSubject(): string | null {
    return this.getPayload().sub;
  }

  getRedirectRoute(): string {
    return this.isAdmin() ? '/admin' : '';
  }




  // saveToken(token: string): void {
  //   localStorage.setItem('auth_token', token);
  // }

  // getToken(): string | null {
  //   return localStorage.getItem('auth_token');
  // }

  // removeToken(): void {
  //   localStorage.removeItem('auth_token');
  // }

  // isAdmin(): boolean {
  //   const token = this.getToken();
  //   if (!token) return false;
  //   const decoded: any = jwtDecode(token);
  //   // Ajusta 'roles' según cómo los envíes desde Spring Boot
  //   return decoded.roles && decoded.roles.includes('ROLE_ADMIN');
  // }

  // getUsername(): string | null {
  //   const token = this.getToken();
  //   if (!token) return null;
  //   const decoded: any = jwtDecode(token);
  //   return decoded.sub; // El 'subject' del JWT suele ser el username
  // }
}