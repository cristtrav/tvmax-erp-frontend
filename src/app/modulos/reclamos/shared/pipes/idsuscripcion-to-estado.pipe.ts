import { Pipe, PipeTransform } from '@angular/core';
import { Suscripcion } from '@dto/suscripcion-dto';

@Pipe({
  name: 'idsuscripcionToEstado'
})
export class IdsuscripcionToEstadoPipe implements PipeTransform {

  transform(idsuscripcion: number, suscripciones: Suscripcion[]): string {
    return suscripciones.find(s => s.id == idsuscripcion)?.estado ?? '';
  }

}
