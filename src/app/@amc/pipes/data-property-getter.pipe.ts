import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dataPropertyGetter',
  standalone: true
})
export class DataPropertyGetterPipe implements PipeTransform {
  transform(object: any, name: string, ...args: unknown[]): unknown {
    const keys = name.split('.');
    return keys.reduce((obj, k) => obj ? obj[k] : '', object);
  }
}
