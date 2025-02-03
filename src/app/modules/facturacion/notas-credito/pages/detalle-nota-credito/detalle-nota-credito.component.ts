import { Component } from '@angular/core';
import { NotaCreditoDetalleDTO } from '@dto/facturacion/nota-credito-detalle.dto';

@Component({
  selector: 'app-detalle-nota-credito',
  templateUrl: './detalle-nota-credito.component.html',
  styleUrls: ['./detalle-nota-credito.component.scss']
})
export class DetalleNotaCreditoComponent {

  idnota: string = 'nueva';
  lstDetallesNota: NotaCreditoDetalleDTO[] = [];

}
