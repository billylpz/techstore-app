import { Component, input,  output } from '@angular/core';
import { Brand } from '../../interfaces/brand.interface';
import { ActiveStateColorPipe } from "../../../shared/pipes/active-state-color.pipe";
import { DatePipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'brands-table-mobile',
  templateUrl: './brands-table-mobile.component.html',
  styleUrls: ['./brands-table-mobile.component.css'],
  imports: [ActiveStateColorPipe, NgClass, RouterLink, DatePipe]
})
export class BrandsTableMobileComponent {
  brands = input.required<Brand[] | undefined>();
  onDelete = output<Brand>()

  eliminar(brand: Brand) {
    this.onDelete.emit(brand);
  }
}
