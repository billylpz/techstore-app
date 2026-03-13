import {  Injectable } from '@angular/core';

import { Category } from '../interfaces/category.interface';
import { CommonService } from '../../shared/service/common.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends CommonService<Category> {

 constructor(){
  super("/api/categories")
 }

}
