import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'termcut',
})
export class TermcutPipe implements PipeTransform {
  transform(value: string, limit: number): string {
    if (!value) '';
    return value.length > limit ?
      value.substring(0, limit) + '...' : value;
  }
}
