import { Pipe, PipeTransform } from '@angular/core';
import { MaterialDTO } from '@dto/depositos/material.dto';

@Pipe({
  name: 'cantidadMaterial'
})
export class CantidadMaterialPipe implements PipeTransform {

  transform(value: MaterialDTO | null | undefined): string {
    if(value == null) return '';
    const cantidad = Number(value.cantidad);
    if(value.unidadmedida == 'UD' && cantidad == 1) return `${cantidad} unidad`;
    if(value.unidadmedida == 'UD' && cantidad != 1) return `${cantidad} unidades`;
    if(value.unidadmedida == 'MT' && cantidad == 1) return `${cantidad} metro`;
    if(value.unidadmedida == 'MT' && cantidad != 1) return `${cantidad} metros`;
    return `${cantidad}`;
  }

}
