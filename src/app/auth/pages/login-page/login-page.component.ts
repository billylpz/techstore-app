import { TokenService } from '../../jwt/token.service';
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormErrorLabelComponent } from "../../../shared/components/form-error-label/form-error-label.component";
import { AuthService } from '../../services/auth.service';
import { LoginRequest } from '../../interfaces/login-request';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  imports: [CommonModule, ReactiveFormsModule, FormErrorLabelComponent, RouterLink]
})
export class LoginPageComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private tokenService = inject(TokenService);


  loginForm = this.fb.nonNullable.group({
    username: ['', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(30)
    ]],
    password: ['', [Validators.required]]
  });

  onSubmit(): void {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.getRawValue() as LoginRequest;

      this.authService.login(loginData).subscribe({
        next: response => {
          const url = this.tokenService.isAdmin() ? '/admin' : '';
          this.router.navigate([url])
        },
        error: e => Swal.fire("Error", e, "error")
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }


}
