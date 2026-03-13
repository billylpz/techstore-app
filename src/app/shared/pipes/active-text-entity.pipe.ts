import { Pipe, PipeTransform } from '@angular/core';
// Devuelve 'HABILITADO' / 'NO HABILITADO' dependiendo del campo 'active' de la entidad
@Pipe({
  name: 'activeTextEntity'
})
export class ActiveTextEntityPipe implements PipeTransform {

  transform(value: boolean, args?: any): any {
    return value ? 'HABILITADO' : 'NO HABILITADO';
  }

}
