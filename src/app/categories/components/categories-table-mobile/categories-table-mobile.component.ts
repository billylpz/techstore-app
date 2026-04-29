import { Component, input, OnInit, output } from '@angular/core';
import { Category } from '../../interfaces/category.interface';
import { ActiveStateColorPipe } from "../../../shared/pipes/active-state-color.pipe";
import { RouterLink } from '@angular/router';
import { DatePipe, NgClass } from '@angular/common';

@Component({
  selector: 'categories-table-mobile',
  templateUrl: './categories-table-mobile.component.html',
  styleUrls: ['./categories-table-mobile.component.css'],
  imports: [ActiveStateColorPipe,RouterLink,DatePipe,NgClass]
})
export class CategoriesTableMobileComponent { 

  categories = input.required<Category[] | undefined>();
  onDelete = output<Category>()

  eliminar(category: Category) {
    this.onDelete.emit(category);
  }

}
