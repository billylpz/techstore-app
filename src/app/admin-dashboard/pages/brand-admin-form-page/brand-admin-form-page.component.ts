import { Component, effect, inject} from '@angular/core';
import { FormBuilder,  ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormErrorLabelComponent } from "../../../shared/components/form-error-label/form-error-label.component";
import { BrandService } from '../../../brands/services/brand.service';
import { Brand } from '../../../brands/interfaces/brand.interface';
import Swal from 'sweetalert2';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-brand-admin-form-page',
  templateUrl: './brand-admin-form-page.component.html',
  styleUrls: ['./brand-admin-form-page.component.css'],
  imports: [ReactiveFormsModule, FormErrorLabelComponent,RouterLink]
})
export class BrandAdminFormPageComponent {
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  service = inject(BrandService)

  effects = effect(() => {
    const brand = this.brandResource.value();
    if (brand) {
      this.myForm.patchValue(brand)
    }
  });

  private brandId = toSignal(this.route.paramMap.pipe(
    map((params) => {
      const idParam = params.get('id');
      if (!idParam) { return null }

      const idNumber = Number(idParam);
      if (isNaN(idNumber)) {
        this.router.navigate(['brands'])
        return null
      }
      return idNumber <= 0 ? null : idNumber;
    })
  ), { initialValue: null })

  private brandResource = rxResource({
    params: () => (this.brandId()),
    stream: ({ params: id }) => {
      return this.service.findById(id)
    }
  });

  myForm = this.fb.group({
    id: this.fb.control<number | null>(null),
    name: ['', [Validators.required, Validators.minLength(2)]]
  })

  onSubmit() {
    this.myForm.markAllAsTouched();

    if (this.myForm.invalid) {
      return;
    }

    const brand = this.myForm.value as Brand

    const request = (brand.id && brand.id > 0) ? this.service.update(brand) : this.service.save(brand);

    request.subscribe({
      next: (response) => {
        Swal.fire({
          title: "Marca guardada!",
          text: `${response.name}`,
          icon: "success"
        });

        this.router.navigate(['/admin/brands']);
      }
    });
  }


}
