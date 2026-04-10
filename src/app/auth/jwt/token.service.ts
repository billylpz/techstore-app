import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class TokenService {

  save(token: string) {
    sessionStorage.setItem("auth_token", token);
  }

  clean(): void {
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

  getId(): number | null {
    if (!this.getPayload()) return null;
    const payload: any = this.getPayload();
    return payload.id;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !token ? false : true;
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


}