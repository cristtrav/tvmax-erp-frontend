import { Component, Input } from '@angular/core';
import { ConsultaRucSifenDTO } from '@dto/facturacion/consulta-ruc-sifen.dto';

@Component({
  selector: 'app-detalle-ruc',
  templateUrl: './detalle-ruc.component.html',
  styleUrls: ['./detalle-ruc.component.scss']
})
export class DetalleRucComponent {

  @Input()
  consultaRuc?: ConsultaRucSifenDTO;

}
