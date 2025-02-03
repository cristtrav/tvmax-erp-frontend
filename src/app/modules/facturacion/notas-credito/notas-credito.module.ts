import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotasCreditoRoutingModule } from './notas-credito-routing.module';
import { VistaNotasCreditoComponent } from './pages/vista-notas-credito/vista-notas-credito.component';
import { DetalleNotaCreditoComponent } from './pages/detalle-nota-credito/detalle-nota-credito.component';
import { WorkspaceLayoutModule } from "../../../shared/workspace-layout/workspace-layout.module";
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { TablaNotasCreditoComponent } from './components/tabla-notas-credito/tabla-notas-credito.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { PaddingZerosPipe } from 'src/app/global/pipes/padding-zeros.pipe';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { EstadoFeColorPipe } from './pipes/estado-fe-color.pipe';
import { TituloCambioEstadoPipe } from './pipes/titulo-cambio-estado.pipe';
import { BotonEliminarDisabledPipe } from './pipes/boton-eliminar-disabled.pipe';
import { BotonEliminarTooltipPipe } from './pipes/boton-eliminar-tooltip.pipe';
import { BotonAnularTooltipPipe } from './pipes/boton-anular-tooltip.pipe';
import { BotonAnularDisabledPipe } from './pipes/boton-anular-disabled.pipe';

@NgModule({
  declarations: [
    VistaNotasCreditoComponent,
    DetalleNotaCreditoComponent,
    TablaNotasCreditoComponent,
    TituloCambioEstadoPipe,
    EstadoFeColorPipe,
    BotonEliminarDisabledPipe,
    BotonEliminarTooltipPipe,
    BotonAnularTooltipPipe,
    BotonAnularDisabledPipe
  ],
  imports: [
    CommonModule,
    NotasCreditoRoutingModule,
    WorkspaceLayoutModule,
    NzBreadCrumbModule,
    IconsProviderModule,
    NzGridModule,
    NzButtonModule,
    NzTableModule,
    NzStatisticModule,
    NzToolTipModule,
    PaddingZerosPipe,
    NzTagModule,
    NzTabsModule,
    NzSpinModule,
    NzDescriptionsModule,
    NzSpaceModule
  ]
})
export class NotasCreditoModule { }
