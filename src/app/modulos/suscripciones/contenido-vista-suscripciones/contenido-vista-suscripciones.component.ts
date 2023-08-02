import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { TablaSuscripcionesComponent } from '../tabla-suscripciones/tabla-suscripciones.component';

@Component({
  selector: 'app-contenido-vista-suscripciones',
  templateUrl: './contenido-vista-suscripciones.component.html',
  styleUrls: ['./contenido-vista-suscripciones.component.scss']
})
export class ContenidoVistaSuscripcionesComponent implements OnInit {

  @ViewChild(TablaSuscripcionesComponent)
  tablaSuscrpcionesComp!: TablaSuscripcionesComponent

  @Input()
  idcliente: number | null = null;
  @Input()
  mostrarCliente: boolean = false;

  paramsFiltros: IParametroFiltro = {};

  textoBusqueda: string = '';
  cantFiltrosAplicados: number = 0;
  drawerFiltrosVisible: boolean = false;

  timerBusqueda: any;

  constructor(
  ) { }

  ngOnInit(): void {

  }
}