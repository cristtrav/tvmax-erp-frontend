import { Pipe, PipeTransform } from '@angular/core';
import { Talonario } from '@dto/facturacion/talonario.dto';

@Pipe({
  name: 'findTalonario'
})
export class FindTalonarioPipe implements PipeTransform {

  transform(value: number | null, lstTalonarios: Talonario[]): Talonario | null {
    if(!value) return null;
    return lstTalonarios.find(t => t.id == value) ?? null;
  }

}
