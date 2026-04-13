import { Component, DestroyRef, effect, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../../users/services/user.service';
import { rxResource, takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import Swal from 'sweetalert2';
import { TokenService } from '../../../auth/jwt/token.service';
import { map } from 'rxjs';
import { FormErrorLabelComponent } from "../../../shared/components/form-error-label/form-error-label.component";
import { User } from '../../../users/interfaces/user.interface';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile-page.component.html',
  styleUrls: ['./edit-profile-page.component.css'],
  imports: [ReactiveFormsModule, FormErrorLabelComponent, RouterLink]
})
export class EditProfilePageComponent implements OnInit {
  fb = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(UserService)
  private tokenService = inject(TokenService)

  constructor() { }

  ngOnInit() {
    let isFirstAlert = true;

    this.myForm.get('username')?.valueChanges.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      if (isFirstAlert) {
        if (this.myForm.get("id")?.value != null && (this.myForm.get("id")?.value == this.tokenService.getId())) {
          Swal.fire({
            title: "Aviso",
            text: "Si modificas tu username, tu sesión se cerrará y serás redirigido al login.",
            icon: "info",
          });
        }
        isFirstAlert = false;
      }
    })
  }

  myForm = this.fb.group({
    id: this.fb.control<number | null>(null),
    name: ['', [Validators.required, Validators.minLength(2)]],
    lastname: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required, Validators.minLength(5)]],
  });

  effects = effect(() => {
    const user = this.userResource.value();
    if (user) {
      this.myForm.patchValue(user)
    }
  });

  private userId = toSignal(this.route.paramMap.pipe(
    map((params) => {
      const idParam = params.get('id');
      if (!idParam) { return null }

      const idNumber = Number(idParam);
      if (isNaN(idNumber)) {
        this.router.navigate([''])
        return null
      }
      return idNumber <= 0 ? null : idNumber;
    })
  ), { initialValue: null })

  private userResource = rxResource({
    params: () => (this.userId()),
    stream: ({ params: id }) => {
      return this.service.findById(id)
    }
  });


  onSubmit() {
    this.myForm.markAllAsTouched();

    if (this.myForm.invalid) {
      return;
    }

    const user = this.myForm.value as User
    const request = (user.id && user.id > 0) ? this.service.update(user) : null;

    if (request) {
      request.pipe(
        takeUntilDestroyed(this.destroyRef)
      ).subscribe({
        next: (response) => {
          Swal.fire({
            title: "Usuario guardado!",
            text: `Nombres: ${response.name} ${response.lastname}`,
            icon: "success"
          }).then(() => {
            if (response.username != this.tokenService.getSubject()) {
              this.tokenService.clean();
              this.router.navigate(['/auth/login']);
            } else {
              this.router.navigate(['']);
            }
          });
        }
      });
    }

  }

}
