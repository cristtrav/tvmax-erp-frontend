import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteSuscripcionesComponent } from './reporte-suscripciones/reporte-suscripciones.component';
import { ReporteSuscripcionesListaComponent } from './reporte-suscripciones-lista/reporte-suscripciones-lista.component';
import { ReporteSuscripcionesResumenComponent } from './reporte-suscripciones-resumen/reporte-suscripciones-resumen.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { FacturaVentaComponent } from './factura-venta/factura-venta.component';

@NgModule({
  declarations: [
    ReporteSuscripcionesComponent,
    ReporteSuscripcionesListaComponent,
    ReporteSuscripcionesResumenComponent,
    FacturaVentaComponent
  ],
  imports: [
    CommonModule,
    NzGridModule,
    NzDescriptionsModule,
    NzSpaceModule
  ],
  exports: [
    ReporteSuscripcionesComponent
  ]
})
export class ImpresionModule { }
