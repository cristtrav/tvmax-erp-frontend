import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { PaddingZerosPipe } from 'src/app/global/pipes/padding-zeros.pipe';
import { NumeroALetrasPipe } from 'src/app/global/pipes/numero-a-letras.pipe';
import { StringToNumberPipe } from 'src/app/global/pipes/string-to-number.pipe';
import { ReporteDetallesVentasComponent } from './reporte-detalles-ventas/reporte-detalles-ventas.component';
import { ReporteMovimientoMaterialComponent } from './reporte-movimiento-material/reporte-movimiento-material.component';
import { ReporteMaterialesComponent } from './reporte-materiales/reporte-materiales.component';
import { JoinPipe } from 'src/app/global/pipes/join.pipe';

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
    ReporteDetallesVentasComponent,
    ReporteMovimientoMaterialComponent,
    ReporteMaterialesComponent
  ],
  imports: [
    CommonModule,
    NzGridModule,
    NzDescriptionsModule,
    NzSpaceModule,
    PaddingZerosPipe,
    NumeroALetrasPipe,
    StringToNumberPipe,
    JoinPipe
  ],
  exports: [
    ReporteSuscripcionesComponent, FacturaPreimpresaVentaComponent
  ],
  providers: []
})
export class ImpresionModule { }
