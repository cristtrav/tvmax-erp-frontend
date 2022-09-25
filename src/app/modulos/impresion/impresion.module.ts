import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReporteSuscripcionesComponent } from './reporte-suscripciones/reporte-suscripciones.component';
import { ReporteSuscripcionesListaComponent } from './reporte-suscripciones-lista/reporte-suscripciones-lista.component';
import { ReporteSuscripcionesResumenComponent } from './reporte-suscripciones-resumen/reporte-suscripciones-resumen.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { FacturaVentaComponent } from './factura-venta/factura-venta.component';
import { CabeceraReporteComponent } from './cabecera-reporte/cabecera-reporte.component';
import { FiltrosReporteComponent } from './filtros-reporte/filtros-reporte.component';
import { ReporteVentasComponent } from './reporte-ventas/reporte-ventas.component';
import { TablaReporteComponent } from './tabla-reporte/tabla-reporte.component';


@NgModule({
  declarations: [
    ReporteSuscripcionesComponent,
    ReporteSuscripcionesListaComponent,
    ReporteSuscripcionesResumenComponent,
    FacturaVentaComponent,
    CabeceraReporteComponent,
    FiltrosReporteComponent,
    ReporteVentasComponent,
    TablaReporteComponent
  ],
  imports: [
    CommonModule,
    NzGridModule,
    NzDescriptionsModule,
    NzSpaceModule
  ],
  exports: [
    ReporteSuscripcionesComponent
  ],
  providers: [
    DatePipe
  ]
})
export class ImpresionModule { }
