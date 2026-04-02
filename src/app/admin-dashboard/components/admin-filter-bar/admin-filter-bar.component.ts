import { Component, DestroyRef, inject, OnInit, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl,  ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { PaginatorService } from '../../../shared/components/paginator/paginator.service';

@Component({
  selector: 'admin-filter-bar',
  templateUrl: './admin-filter-bar.component.html',
  styleUrls: ['./admin-filter-bar.component.css'],
  host: {
    class: 'w-200'
  },
  imports: [ReactiveFormsModule]
})
export class AdminFilterBarComponent implements OnInit {
  destroyRef = inject(DestroyRef);
  paginatorService = inject(PaginatorService);
  searchByName = new FormControl('');
  searchByNameValueEmitter = output<string>();
  filterSelectionEmitter = output<string>();

  ngOnInit(): void {
    this.searchByName.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(value => {
      this.searchByNameValueEmitter.emit(value ?? '');
      //reseteamos el param page a 1
      this.paginatorService.reset()
    });
  }

  onFilterChange(value: string) {
    this.filterSelectionEmitter.emit(value);
    // Siempre que filtramos, volvemos a la página 1
    this.paginatorService.reset()
  }

}
