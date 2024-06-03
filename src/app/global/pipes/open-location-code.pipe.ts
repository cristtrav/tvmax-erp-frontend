import { Pipe, PipeTransform } from '@angular/core';
import OpenLocationCode from 'open-location-code-typescript';

@Pipe({
  name: 'openLocationCode',
  standalone: true
})
export class OpenLocationCodePipe implements PipeTransform {

  transform(value: [number, number]): string { 
    if(value != null && Array.isArray(value) && !Number.isNaN(value[0]) && !Number.isNaN(value[1])){
      const code = OpenLocationCode.encode(value[0], value[1], 11);
      const shorten = OpenLocationCode.shorten(code, Number(value[0].toFixed(1)), Number(value[1].toFixed(1)));
      return shorten;
    }
    return '';
  }

}
