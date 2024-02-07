import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MotivosRoutingModule } from './motivos-routing.module';
import { VistaMotivosComponent } from './vista-motivos/vista-motivos.component';
import { DetalleMotivoComponent } from './detalle-motivo/detalle-motivo.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { LoadingStatusPipe } from '@util/pipes/loading-status.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzColResponsiveSizesDirective } from '@global-directives/responsive/nz-col-responsive-sizes.directive';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';


@NgModule({
  declarations: [
    VistaMotivosComponent,
    DetalleMotivoComponent
  ],
  imports: [
    CommonModule,
    MotivosRoutingModule,
    NzBreadCrumbModule,
    IconsProviderModule,
    NzButtonModule,
    NzTableModule,
    NzGridModule,
    NzInputModule,
    NzToolTipModule,
    LoadingStatusPipe,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzColResponsiveSizesDirective,
    NzSpinModule,
    NzInputNumberModule
  ]
})
export class MotivosModule { }
