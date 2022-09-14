import { Component, Input, OnInit } from '@angular/core';
import { IFiltroReporte } from '@util/interfaces/ifiltros-reporte.interface';

@Component({
  selector: 'app-filtros-reporte',
  templateUrl: './filtros-reporte.component.html',
  styleUrls: ['./filtros-reporte.component.scss']
})
export class FiltrosReporteComponent implements OnInit {

  @Input()
  lstFiltrosReporte: IFiltroReporte[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
