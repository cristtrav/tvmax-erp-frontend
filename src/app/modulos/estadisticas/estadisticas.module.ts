import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EstadisticasRoutingModule } from './estadisticas-routing.module';
import { ContenidoEstadisticasSuscripcionesComponent } from './suscripciones/contenido-estadisticas-suscripciones/contenido-estadisticas-suscripciones.component';
import { VistaEstadisticasSuscripcionesComponent } from './suscripciones/vista-estadisticas-suscripciones/vista-estadisticas-suscripciones.component';
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
import { CardResumenCuotasPendientesComponent } from './suscripciones/card-resumen-cuotas-pendientes/card-resumen-cuotas-pendientes.component';
import { CardResumenEstadosComponent } from './suscripciones/card-resumen-estados/card-resumen-estados.component';
import { CardResumenSuscripcionesGruposServiciosComponent } from './suscripciones/card-resumen-suscripciones-grupos-servicios/card-resumen-suscripciones-grupos-servicios.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { CardResumenSuscripcionesDepartDistritoComponent } from './suscripciones/card-resumen-suscripciones-depart-distrito/card-resumen-suscripciones-depart-distrito.component';
import { VistaEstadisticasVentasComponent } from './ventas/vista-estadisticas-ventas/vista-estadisticas-ventas.component';
import { ContenidoEstadisticasVentasComponent } from './ventas/contenido-estadisticas-ventas/contenido-estadisticas-ventas.component';
import { CardResumenVentasGruposServiciosComponent } from './ventas/card-resumen-ventas-grupos-servicios/card-resumen-ventas-grupos-servicios.component';
import { CardResumenVentasCobradoresComponent } from './ventas/card-resumen-ventas-cobradores/card-resumen-ventas-cobradores.component';
import { NzAlertModule } from 'ng-zorro-antd/alert';

@NgModule({
  declarations: [
    ContenidoEstadisticasSuscripcionesComponent,
    VistaEstadisticasSuscripcionesComponent,
    CardResumenCuotasPendientesComponent,
    CardResumenEstadosComponent,
    CardResumenSuscripcionesGruposServiciosComponent,
    CardResumenSuscripcionesDepartDistritoComponent,
    VistaEstadisticasVentasComponent,
    ContenidoEstadisticasVentasComponent,
    CardResumenVentasGruposServiciosComponent,
    CardResumenVentasCobradoresComponent
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
