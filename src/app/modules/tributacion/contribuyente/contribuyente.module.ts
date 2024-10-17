import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContribuyenteRoutingModule } from './contribuyente-routing.module';
import { DetalleContribuyenteComponent } from './pages/detalle-contribuyente/detalle-contribuyente.component';
import { WorkspaceLayoutModule } from '@shared/workspace-layout';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzColResponsiveSizesDirective } from '@global-directives/responsive/nz-col-responsive-sizes.directive';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSpinModule } from 'ng-zorro-antd/spin';


@NgModule({
  declarations: [
    DetalleContribuyenteComponent
  ],
  imports: [
    CommonModule,
    ContribuyenteRoutingModule,
    WorkspaceLayoutModule,
    NzBreadCrumbModule,
    ReactiveFormsModule,
    NzFormModule,
    IconsProviderModule,
    NzInputModule,
    NzButtonModule,
    NzColResponsiveSizesDirective,
    NzGridModule,
    NzSpinModule
  ],
  providers: [NzNotificationService]
})
export class ContribuyenteModule { }
