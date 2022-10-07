import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { TablaDetalleVentasCobrosComponent } from '../tabla-detalle-ventas-cobros/tabla-detalle-ventas-cobros.component';

@Component({
  selector: 'app-vista-cobros',
  templateUrl: './vista-cobros.component.html',
  styleUrls: ['./vista-cobros.component.scss']
})
export class VistaCobrosComponent implements OnInit {

  @Input()
  public paramsFiltros: IParametroFiltro = {};

  public loadingImpresion: boolean = false;
  public textoBusqueda: string = '';
  public cantFiltrosAplicados: number = 0;
  public drawerFiltrosVisible: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  public imprimir(){

  }

}
