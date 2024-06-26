import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomiciliosRoutingModule } from './domicilios-routing.module';
import { VistaDomiciliosComponent } from './pages/vista-domicilios/vista-domicilios.component';
import { IconsProviderModule } from '../../icons-provider.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { DetalleDomicilioComponent } from './pages/detalle-domicilio/detalle-domicilio.component';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { UbicacionComponent } from './components/ubicacion/ubicacion.component';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { OpenLocationCodePipe } from 'src/app/global/pipes/open-location-code.pipe';
import { WorkspaceLayoutModule } from '@shared/workspace-layout';
import { NzColResponsiveSizesDirective } from '@global-directives/responsive/nz-col-responsive-sizes.directive';
import { FormDomicilioComponent } from './components/form-domicilio/form-domicilio.component';
import { ContenidoVistaDomiciliosComponent } from './components/contenido-vista-domicilios/contenido-vista-domicilios.component';

@NgModule({
  declarations: [
    VistaDomiciliosComponent,
    ContenidoVistaDomiciliosComponent,
    FormDomicilioComponent,
    DetalleDomicilioComponent,
    UbicacionComponent
  ],
  imports: [
    CommonModule,
    DomiciliosRoutingModule,
    IconsProviderModule,
    NzButtonModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzInputNumberModule,
    NzFormModule,
    NzSelectModule,
    NzNotificationModule,
    NzCheckboxModule,
    NzTableModule,
    NzDividerModule,
    NzPopconfirmModule,
    NzSpinModule,
    NzToolTipModule,
    NzSpaceModule,
    NzTagModule,
    NzTypographyModule,
    NzModalModule,
    NzDescriptionsModule,
    NzGridModule,
    NzBreadCrumbModule,
    NzRadioModule,
    NzAlertModule,
    OpenLocationCodePipe,
    WorkspaceLayoutModule,
    NzColResponsiveSizesDirective
  ],
  exports: [ContenidoVistaDomiciliosComponent, FormDomicilioComponent, UbicacionComponent] 
})
export class DomiciliosModule { }
