import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReporteSuscripcionesComponent } from './reporte-suscripciones/reporte-suscripciones.component';
import { ReporteSuscripcionesResumenComponent } from './reporte-suscripciones-resumen/reporte-suscripciones-resumen.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { FacturaVentaComponent } from './factura-venta/factura-venta.component';
import { CabeceraReporteComponent } from './cabecera-reporte/cabecera-reporte.component';
import { FiltrosReporteComponent } from './filtros-reporte/filtros-reporte.component';
import { ReporteVentasComponent } from './reporte-ventas/reporte-ventas.component';
import { TablaReporteComponent } from './tabla-reporte/tabla-reporte.component';
import { FacturaPreimpresaVentaComponent } from './factura-preimpresa-venta/factura-preimpresa-venta.component';
import { PaddingZerosPipe } from '@util/pipes/padding-zeros.pipe';
import { NumeroALetrasPipe } from '@util/pipes/numero-a-letras.pipe';
import { StringToNumberPipe } from '@util/pipes/string-to-number.pipe';
import { ReporteCobrosComponent } from './reporte-cobros/reporte-cobros.component';


@NgModule({
  declarations: [
    ReporteSuscripcionesComponent,
    ReporteSuscripcionesResumenComponent,
    FacturaVentaComponent,
    CabeceraReporteComponent,
    FiltrosReporteComponent,
    ReporteVentasComponent,
    TablaReporteComponent,
    FacturaPreimpresaVentaComponent,
    ReporteCobrosComponent
  ],
  imports: [
    CommonModule,
    NzGridModule,
    NzDescriptionsModule,
    NzSpaceModule,
    PaddingZerosPipe,
    NumeroALetrasPipe,
    StringToNumberPipe
  ],
  exports: [
    ReporteSuscripcionesComponent, FacturaPreimpresaVentaComponent
  ],
  providers: []
})
export class ImpresionModule { }
