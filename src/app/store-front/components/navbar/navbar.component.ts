import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { CategoryService } from '../../../categories/services/category.service';
import { BrandService } from '../../../brands/services/brand.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [RouterLink, ReactiveFormsModule]
})
export class NavbarComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);
  private brandService = inject(BrandService);
  private router = inject(Router);
  private selectedCategory = signal<string>('');
  private selectedBrand = signal<string>('');
  searchBy = this.fb.control('');
  brandSelect = this.fb.control('')
  categorySelect = this.fb.control('')

  ngOnInit(): void {
    this.searchBy.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => {
      this.router.navigate([''], {
        queryParams: { name: value },
      });
      this.searchBy.setValue('',{emitEvent:false})
    });

    this.brandSelect.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.selectedBrand.set(value ?? '');
        this.router.navigate([''], {
          queryParams: { brandId: this.selectedBrand() },
        })
        this.brandSelect.setValue('', { emitEvent: false })
      });

    this.categorySelect.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => {
        this.selectedCategory.set(value ?? '');
        this.router.navigate([''], {
          queryParams: { categoryId: this.selectedCategory() },
        });
        this.categorySelect.setValue('', { emitEvent: false })
      })

  }

  categoriesResource = rxResource({
    params: () => ({}),
    stream: () => {
      return this.categoryService.findAllActive({ page: 0, size: 100 })
    }
  });

  brandsResource = rxResource({
    params: () => ({}),
    stream: () => {
      return this.brandService.findAllActive({ page: 0, size: 100 })
    }
  });

}
