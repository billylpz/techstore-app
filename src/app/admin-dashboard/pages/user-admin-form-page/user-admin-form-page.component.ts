import { Component, effect, inject, OnInit } from '@angular/core';
import { toSignal, rxResource } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import Swal from 'sweetalert2';
import { User } from '../../../users/interfaces/user.interface';
import { UserService } from '../../../users/services/user.service';
import { FormErrorLabelComponent } from "../../../shared/components/form-error-label/form-error-label.component";

@Component({
  selector: 'app-user-admin-form-page',
  templateUrl: './user-admin-form-page.component.html',
  styleUrls: ['./user-admin-form-page.component.css'],
  imports: [ReactiveFormsModule, RouterLink, FormErrorLabelComponent]
})
export class UserAdminFormPageComponent {

  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  service = inject(UserService)

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
        this.router.navigate(['users'])
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

  myForm = this.fb.group({
    id: this.fb.control<number | null>(null),
    name: ['', [Validators.required, Validators.minLength(2)]],
    lastname: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email, Validators.minLength(2)]],
    username: ['', [Validators.required, Validators.minLength(2)]],
  })

  onSubmit() {
    this.myForm.markAllAsTouched();

    if (this.myForm.invalid) {
      return;
    }

    const user = this.myForm.value as User

    const request = (user.id && user.id > 0) ? this.service.update(user) : this.service.save(user);

    request.subscribe({
      next: (response) => {
        Swal.fire({
          title: "Usuario guardado!",
          text: `${response.name}`,
          icon: "success"
        });

        this.router.navigate(['/admin/users']);
      }
    });
  }


}
