import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormatoFacturaA } from 'src/app/modulos/impresion/factura-preimpresa-venta/formato-factura-a';

@Component({
  selector: 'app-formulario-formato-pre-a',
  templateUrl: './formulario-formato-pre-a.component.html',
  styleUrls: ['./formulario-formato-pre-a.component.scss']
})
export class FormularioFormatoPreAComponent implements OnInit {

  formLabelWidth: number = 12;
  formControlWidth: number = 12;

  @Input()
  parametros: FormatoFacturaA = new FormatoFacturaA();
  @Output()
  parametrosChange = new EventEmitter<FormatoFacturaA>()

  constructor() { }

  ngOnInit(): void {
  }

  emitirCambios(){
    this.parametrosChange.emit(this.parametros);
  }

}
