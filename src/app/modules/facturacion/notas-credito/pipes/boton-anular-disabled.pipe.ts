import { Pipe, PipeTransform } from '@angular/core';
import { NotaCreditoDTO } from '@dto/facturacion/nota-credito.dto';

@Pipe({
  name: 'botonAnularDisabled'
})
export class BotonAnularDisabledPipe implements PipeTransform {

  transform(nota: NotaCreditoDTO): boolean {
    return nota.idestadodte != 1 && nota.idestadodte != 2;
  }

}
