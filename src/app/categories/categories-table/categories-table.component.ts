import { Component, input, OnInit, output } from '@angular/core';
import { Category } from '../interfaces/category.interface';
import { ActiveStateColorPipe } from "../../shared/pipes/active-state-color.pipe";
import { ActiveTextEntityPipe } from "../../shared/pipes/active-text-entity.pipe";
import { DatePipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'categories-table',
  templateUrl: './categories-table.component.html',
  styleUrls: ['./categories-table.component.css'],
  imports: [ActiveStateColorPipe, ActiveTextEntityPipe,NgClass,RouterLink,DatePipe]
})
export class CategoriesTableComponent {

  categories = input.required<Category[] | undefined>();
  onDelete = output<Category>()

  eliminar(category: Category) {
    this.onDelete.emit(category);
  }

}
