import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CodigosSeguridadContribuyenteRoutingModule } from './codigos-seguridad-contribuyente-routing.module';
import { VistaCscComponent } from './pages/vista-csc/vista-csc.component';
import { DetalleCscComponent } from './pages/detalle-csc/detalle-csc.component';
import { WorkspaceLayoutModule } from '@shared/workspace-layout';
import { NzColResponsiveSizesDirective } from '@global-directives/responsive/nz-col-responsive-sizes.directive';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { ReactiveFormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';


@NgModule({
  declarations: [
    VistaCscComponent,
    DetalleCscComponent
  ],
  imports: [
    CommonModule,
    CodigosSeguridadContribuyenteRoutingModule,
    WorkspaceLayoutModule,
    NzColResponsiveSizesDirective,
    IconsProviderModule,
    NzBreadCrumbModule,
    NzGridModule,
    NzButtonModule,
    NzInputModule,
    NzInputNumberModule,
    ReactiveFormsModule,
    NzFormModule,
    NzTableModule,
    NzSpinModule,
    NzTagModule,
    NzCheckboxModule
  ]
})
export class CodigosSeguridadContribuyenteModule { }
