import { Injectable } from '@angular/core';
import { Brand } from '../interfaces/brand.interface';
import { CommonService } from '../../shared/service/common.service';


@Injectable({
  providedIn: 'root'
})
export class BrandService extends CommonService<Brand> {

  constructor() {
    super("/api/brands")
  }
}
