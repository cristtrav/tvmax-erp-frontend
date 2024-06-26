import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TiposMaterialesRoutingModule } from './tipos-materiales-routing.module';
import { VistaTiposMaterialesComponent } from './pages/vista-tipos-materiales/vista-tipos-materiales.component';
import { DetalleTipoMaterialComponent } from './pages/detalle-tipo-material/detalle-tipo-material.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { WorkspaceLayoutModule } from '@shared/workspace-layout';
import { NzColResponsiveSizesDirective } from '@global-directives/responsive/nz-col-responsive-sizes.directive';


@NgModule({
  declarations: [
    VistaTiposMaterialesComponent,
    DetalleTipoMaterialComponent
  ],
  imports: [
    CommonModule,
    TiposMaterialesRoutingModule,
    NzBreadCrumbModule,
    IconsProviderModule,
    NzButtonModule,
    NzGridModule,
    NzTableModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    FormsModule,
    ReactiveFormsModule,
    NzToolTipModule,
    NzModalModule,
    WorkspaceLayoutModule,
    NzColResponsiveSizesDirective
  ]
})
export class TiposMaterialesModule { }
