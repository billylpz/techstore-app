import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { TokenService } from '../../../auth/jwt/token.service';

@Component({
  selector: 'admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css'],
  imports: [RouterLink]
})
export class AdminNavbarComponent {
  tokenService = inject(TokenService);
  router = inject(Router);

  logOut(): void {
    this.tokenService.remove();
    this.router.navigate(['/auth'])
  }
}
