import { Component, input, OnInit, output } from '@angular/core';
import { Brand } from '../../interfaces/brand.interface';
import { RouterLink } from '@angular/router';
import { DatePipe, NgClass } from '@angular/common';
import { ActiveStateColorPipe } from "../../../shared/pipes/active-state-color.pipe";
import { ActiveTextEntityPipe } from "../../../shared/pipes/active-text-entity.pipe";

@Component({
  selector: 'brands-table',
  templateUrl: './brands-table.component.html',
  styleUrls: ['./brands-table.component.css'],
  imports: [RouterLink, DatePipe, ActiveStateColorPipe, NgClass, ActiveTextEntityPipe]
})
export class BrandsTableComponent {

  brands = input.required<Brand[] | undefined>();
  onDelete = output<Brand>()

  eliminar(brand: Brand) {
    this.onDelete.emit(brand);
  }
}
