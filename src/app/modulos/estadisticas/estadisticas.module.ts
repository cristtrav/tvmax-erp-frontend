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

@NgModule({
  declarations: [
    ContenidoEstadisticasSuscripcionesComponent,
    VistaEstadisticasSuscripcionesComponent,
    CardResumenCuotasPendientesComponent,
    CardResumenEstadosComponent,
    CardResumenSuscripcionesGruposServiciosComponent
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
    NzToolTipModule
  ],
  exports: [
    ContenidoEstadisticasSuscripcionesComponent
  ]
})
export class EstadisticasModule { }
