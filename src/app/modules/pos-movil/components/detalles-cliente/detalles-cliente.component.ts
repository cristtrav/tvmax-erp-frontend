import { Component, Input } from '@angular/core';
import { Cliente } from '@dto/cliente-dto';

@Component({
  selector: 'app-detalles-cliente',
  templateUrl: './detalles-cliente.component.html',
  styleUrls: ['./detalles-cliente.component.scss']
})
export class DetallesClienteComponent {

  @Input()
  cliente?: Cliente | null;

}
