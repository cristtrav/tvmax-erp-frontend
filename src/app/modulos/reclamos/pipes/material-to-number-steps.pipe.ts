import { Pipe, PipeTransform } from '@angular/core';
import { MaterialDTO } from '@dto/material.dto';

@Pipe({
  name: 'materialToNumberSteps',
  standalone: true
})
export class MaterialToNumberStepsPipe implements PipeTransform {

  transform(idmaterial: number | null | undefined, materiales: MaterialDTO[]): number {
    if(idmaterial == null) return 1;
    const material = materiales.find(m => m.id == idmaterial);
    if(!material) return 1;
    if(material.unidadmedida == 'MT') return 0.01;
    else return 1;
  }

}
