import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiciosRoutingModule } from './servicios-routing.module';
import { VistaServiciosComponent } from './pages/vista-servicios/vista-servicios.component';
import { DetalleServicioComponent } from './pages/detalle-servicio/detalle-servicio.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { IconsProviderModule } from '../../icons-provider.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSpaceModule} from 'ng-zorro-antd/space';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { WorkspaceLayoutModule } from '@shared/workspace-layout';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzColResponsiveSizesDirective } from '@global-directives/responsive/nz-col-responsive-sizes.directive';

@NgModule({
  declarations: [VistaServiciosComponent, DetalleServicioComponent],
  imports: [
    CommonModule,
    ServiciosRoutingModule,
    NzBreadCrumbModule,
    IconsProviderModule,
    NzButtonModule,
    NzGridModule,
    NzFormModule,
    NzInputNumberModule,
    NzInputModule,
    NzSelectModule,
    NzNotificationModule,
    NzCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzDividerModule,
    NzToolTipModule,
    NzSpinModule,
    NzSpaceModule,
    NzBadgeModule,
    NzDrawerModule,
    NzTypographyModule,
    NzTagModule,
    WorkspaceLayoutModule,
    NzModalModule,
    NzColResponsiveSizesDirective
  ]
})
export class ServiciosModule { }
