import { Component, DestroyRef, effect, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed, toSignal, rxResource } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import Swal from 'sweetalert2';
import { TokenService } from '../../../../auth/jwt/token.service';
import { User } from '../../../../users/interfaces/user.interface';
import { UserService } from '../../../../users/services/user.service';
import { FormErrorLabelComponent } from "../../../../shared/components/form-error-label/form-error-label.component";
import { PasswordChangeRequest } from '../../../../users/interfaces/password-change-request.interface';
import { FormUtils } from '../../../../shared/utils/form-utils';

@Component({
  selector: 'app-user-admin-change-password-page',
  templateUrl: './user-admin-change-password-page.component.html',
  styleUrls: ['./user-admin-change-password-page.component.css'],
  imports: [FormErrorLabelComponent, ReactiveFormsModule, RouterLink],
})
export class UserAdminChangePasswordPageComponent {
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  private service = inject(UserService)
  private tokenService = inject(TokenService)
  fb = inject(FormBuilder);

  myForm = this.fb.group({
    currentPassword: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
  },
    { validators: [FormUtils.passwordMatchValidator] })

  onSubmit() {
    this.myForm.markAllAsTouched();

    if (this.myForm.invalid) {
      return;
    }

    const request = this.myForm.value as PasswordChangeRequest
    request.currentPassword = this.myForm.get('currentPassword')?.value?.trim() ?? ''
    request.newPassword = this.myForm.get('password')?.value?.trim() ?? ''

    this.service.changePassword(request).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        Swal.fire({
          title: "Contraseña guardada!",
          text: `Por seguridad deberás iniciar sesión de nuevo.`,
          icon: "success"
        }).then(() => {
          this.tokenService.clean();
          this.router.navigate(['/auth/login']);
        });
      }
    });

  }

}
