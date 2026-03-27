import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { RegisterRequest } from '../../interfaces/register-request';
import { AuthService } from '../../services/auth.service';
import { FormErrorLabelComponent } from "../../../shared/components/form-error-label/form-error-label.component";
import { FormUtils } from '../../../shared/utils/form-utils';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css'],
  imports: [FormErrorLabelComponent, ReactiveFormsModule]
})
export class RegisterPageComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    lastname: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30), FormUtils.forbiddenValues()]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  }, {
    validators: [FormUtils.passwordMatchValidator] // Validación a nivel de grupo
  });



  onSubmit(): void {
    if (this.registerForm.valid) {
      const registerData = this.registerForm.getRawValue() as RegisterRequest;

      this.authService.register(registerData).subscribe({
        next: () => {
          Swal.fire({
            title: "¡Cuenta creada!",
            text: "Te has registrado exitosamente. Ahora puedes iniciar sesión.",
            icon: "success"
          });
          this.router.navigate(['/auth/login']);
        },
        error: (e) => Swal.fire("Error al registrar", e, "error")
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

}
