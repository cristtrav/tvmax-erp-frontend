import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabla-detalle-estado',
  templateUrl: './tabla-detalle-estado.component.html',
  styleUrls: ['./tabla-detalle-estado.component.scss']
})
export class TablaDetalleEstadoComponent implements OnInit {

  @Input()
  titulo: string = '';

  @Input()
  estado: {[clave : string]: number | string | boolean | null } | null = {};

  constructor() { }

  ngOnInit(): void {
  }

  objectToKeyValue(p: {[name: string]: string | number | boolean | null} | null): {key: string, value: string | number | boolean | null}[] {
    if(p) return Object.keys(p).map( k => {return { 'key': k, 'value': p[k]}});
    return [];
  }

  isBoolean(value: string | number | boolean | null): boolean{
    return typeof value === 'boolean';
  }
}
