import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'activeStateColor'
})
export class ActiveStateColorPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return value ? 'text-green-500':'text-red-500';
  }

}
