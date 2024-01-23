import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'join',
  standalone: true
})
export class JoinPipe implements PipeTransform {

  transform(value: string[] | number[] | null | undefined, joinStr: string): string {    
    if(!Array.isArray(value)) return '';
    return value.join(joinStr);
  }

}
