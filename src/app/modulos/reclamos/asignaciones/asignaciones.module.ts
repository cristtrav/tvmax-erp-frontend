import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsignacionesRoutingModule } from './asignaciones-routing.module';
import { VistaAsignacionesReclamosComponent } from './vista-asignaciones-reclamos/vista-asignaciones-reclamos.component';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { DetallesReclamosToTextPipe } from '../pipes/detalles-reclamos-to-text.pipe';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { LoadingStatusPipe } from '@util/pipes/loading-status.pipe';
import { DetalleAsignacionReclamoComponent } from './detalle-asignacion-reclamo/detalle-asignacion-reclamo.component';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { OpenLocationCodePipe } from '@util/pipes/open-location-code.pipe';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FormFinalizarReclamoComponent } from './form-finalizar-reclamo/form-finalizar-reclamo.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzColResponsiveSizesDirective } from '@global-directives/responsive/nz-col-responsive-sizes.directive';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { MaterialToNumberStepsPipe } from '../pipes/material-to-number-steps.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UbicacionReclamoComponent } from './ubicacion-reclamo/ubicacion-reclamo.component';
import { DomiciliosModule } from '../../domicilios/domicilios.module';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { TagEstadosModule } from '../components/tag-estados/tag-estados.module';
import { WorkspaceLayoutModule } from '@shared/workspace-layout';

@NgModule({
  declarations: [
    VistaAsignacionesReclamosComponent,
    DetalleAsignacionReclamoComponent,
    FormFinalizarReclamoComponent,
    UbicacionReclamoComponent,
  ],
  imports: [
    CommonModule,
    AsignacionesRoutingModule,
    IconsProviderModule,
    NzBreadCrumbModule,
    NzListModule,
    NzAvatarModule,
    NzTagModule,
    NzDividerModule,
    NzTypographyModule,
    NzButtonModule,
    NzGridModule,
    DetallesReclamosToTextPipe,
    NzSpinModule,
    LoadingStatusPipe,
    NzDescriptionsModule,
    OpenLocationCodePipe,
    NzEmptyModule,
    NzModalModule,
    NzFormModule,
    NzSelectModule,
    NzInputModule,
    NzColResponsiveSizesDirective,
    NzMessageModule,
    NzInputNumberModule,
    MaterialToNumberStepsPipe,
    ReactiveFormsModule,
    DomiciliosModule,
    NzSwitchModule,
    NzSpaceModule,
    FormsModule,
    TagEstadosModule,
    WorkspaceLayoutModule
  ]
})
export class AsignacionesModule { }
