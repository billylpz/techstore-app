import { Component, effect, inject } from '@angular/core';
import { toSignal, rxResource } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import Swal from 'sweetalert2';
import { CategoryService } from '../../../categories/services/category.service';
import { FormErrorLabelComponent } from "../../../shared/components/form-error-label/form-error-label.component";
import { Category } from '../../../categories/interfaces/category.interface';

@Component({
  selector: 'app-category-admin-form-page',
  templateUrl: './category-admin-form-page.component.html',
  styleUrls: ['./category-admin-form-page.component.css'],
  imports: [ReactiveFormsModule, FormErrorLabelComponent,RouterLink]
})
export class CategoryAdminFormPageComponent {
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  service = inject(CategoryService)

  effects = effect(() => {
    const category = this.categoryResource.value();
    if (category) {
      this.myForm.patchValue(category)
    }
  });

  private categoryId = toSignal(this.route.paramMap.pipe(
    map((params) => {
      const idParam = params.get('id');
      if (!idParam) { return null }

      const idNumber = Number(idParam);
      if (isNaN(idNumber)) {
        this.router.navigate(['categories'])
        return null
      }
      return idNumber <= 0 ? null : idNumber;
    })
  ), { initialValue: null })

  private categoryResource = rxResource({
    params: () => (this.categoryId()),
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

    const category = this.myForm.value as Category

    const request = (category.id && category.id > 0) ? this.service.update(category) : this.service.save(category);

    request.subscribe({
      next: (response) => {
        Swal.fire({
          title: "Categoria guardada!",
          text: `${response.name}`,
          icon: "success"
        });

        this.router.navigate(['/admin/categories']);
      },
      error: (message => {
        Swal.fire("Error", message, "error")
      })
    });
  }

}
