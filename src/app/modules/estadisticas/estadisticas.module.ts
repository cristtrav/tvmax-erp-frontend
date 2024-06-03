import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EstadisticasRoutingModule } from './estadisticas-routing.module';
import { ContenidoEstadisticasSuscripcionesComponent } from './components/suscripciones/contenido-estadisticas-suscripciones/contenido-estadisticas-suscripciones.component';
import { VistaEstadisticasSuscripcionesComponent } from './components/suscripciones/vista-estadisticas-suscripciones/vista-estadisticas-suscripciones.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NzSpinModule} from 'ng-zorro-antd/spin';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { CardResumenCuotasPendientesComponent } from './components/suscripciones/card-resumen-cuotas-pendientes/card-resumen-cuotas-pendientes.component';
import { CardResumenEstadosComponent } from './components/suscripciones/card-resumen-estados/card-resumen-estados.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { VistaEstadisticasVentasComponent } from './components/ventas/vista-estadisticas-ventas/vista-estadisticas-ventas.component';
import { ContenidoEstadisticasVentasComponent } from './components/ventas/contenido-estadisticas-ventas/contenido-estadisticas-ventas.component';
import { CardResumenVentasGruposServiciosComponent } from './components/ventas/card-resumen-ventas-grupos-servicios/card-resumen-ventas-grupos-servicios.component';
import { CardResumenVentasCobradoresComponent } from './components/ventas/card-resumen-ventas-cobradores/card-resumen-ventas-cobradores.component';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { CardResumenSuscripcionesGruposServiciosComponent } from './components/suscripciones/card-resumen-suscripciones-grupos-servicios/card-resumen-suscripciones-grupos-servicios.component';
import { TablaResumenSuscripcionesGruposComponent } from './components/suscripciones/card-resumen-suscripciones-grupos-servicios/tabla-resumen-suscripciones-grupos/tabla-resumen-suscripciones-grupos.component';
import { TablaResumenSuscripcionesServiciosComponent } from './components/suscripciones/card-resumen-suscripciones-grupos-servicios/tabla-resumen-suscripciones-servicios/tabla-resumen-suscripciones-servicios.component';
import { CardResumenSuscripcionesUbicacionesComponent } from './components/suscripciones/card-resumen-suscripciones-ubicaciones/card-resumen-suscripciones-ubicaciones.component';
import { TablaResumenSuscripcionesDepartamentosComponent } from './components/suscripciones/card-resumen-suscripciones-ubicaciones/tabla-resumen-suscripciones-departamentos/tabla-resumen-suscripciones-departamentos.component';
import { TablaResumenSuscripcionesDistritosComponent } from './components/suscripciones/card-resumen-suscripciones-ubicaciones/tabla-resumen-suscripciones-distritos/tabla-resumen-suscripciones-distritos.component';
import { TablaResumenSuscripcionesBarriosComponent } from './components/suscripciones/card-resumen-suscripciones-ubicaciones/tabla-resumen-suscripciones-barrios/tabla-resumen-suscripciones-barrios.component';
import { TablaResumenVentasGruposComponent } from './components/ventas/card-resumen-ventas-grupos-servicios/tabla-resumen-ventas-grupos/tabla-resumen-ventas-grupos.component';
import { TablaResumenVentasServiciosComponent } from './components/ventas/card-resumen-ventas-grupos-servicios/tabla-resumen-ventas-servicios/tabla-resumen-ventas-servicios.component';

@NgModule({
  declarations: [
    ContenidoEstadisticasSuscripcionesComponent,
    VistaEstadisticasSuscripcionesComponent,
    CardResumenCuotasPendientesComponent,
    CardResumenEstadosComponent,
    CardResumenSuscripcionesGruposServiciosComponent,
    VistaEstadisticasVentasComponent,
    ContenidoEstadisticasVentasComponent,
    CardResumenVentasGruposServiciosComponent,
    CardResumenVentasCobradoresComponent,
    CardResumenSuscripcionesGruposServiciosComponent,
    TablaResumenSuscripcionesGruposComponent,
    TablaResumenSuscripcionesServiciosComponent,
    CardResumenSuscripcionesUbicacionesComponent,
    TablaResumenSuscripcionesDepartamentosComponent,
    TablaResumenSuscripcionesDistritosComponent,
    TablaResumenSuscripcionesBarriosComponent,
    TablaResumenVentasGruposComponent,
    TablaResumenVentasServiciosComponent
  ],
  imports: [
    CommonModule,
    EstadisticasRoutingModule,
    NzCardModule,
    NzListModule,
    NzTableModule,
    NzGridModule,
    NzButtonModule,
    IconsProviderModule,
    NzSpinModule,
    NzStatisticModule,
    NzTypographyModule,
    NzTagModule,
    NzToolTipModule,
    NzAlertModule
  ],
  exports: [
    ContenidoEstadisticasSuscripcionesComponent,
    ContenidoEstadisticasVentasComponent
  ]
})
export class EstadisticasModule { }
