import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EstablecimientosRoutingModule } from './establecimientos-routing.module';
import { VistaEstablecimientosComponent } from './pages/vista-establecimientos/vista-establecimientos.component';
import { DetalleEstablecimientoComponent } from './pages/detalle-establecimiento/detalle-establecimiento.component';
import { WorkspaceLayoutModule } from '@shared/workspace-layout';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { Button } from 'protractor';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { PaddingZerosPipe } from 'src/app/global/pipes/padding-zeros.pipe';
import { NzFormModule } from 'ng-zorro-antd/form';
import { ReactiveFormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzColResponsiveSizesDirective } from '@global-directives/responsive/nz-col-responsive-sizes.directive';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';


@NgModule({
  declarations: [
    VistaEstablecimientosComponent,
    DetalleEstablecimientoComponent
  ],
  imports: [
    CommonModule,
    EstablecimientosRoutingModule,
    WorkspaceLayoutModule,
    NzBreadCrumbModule,
    IconsProviderModule,
    NzButtonModule,
    NzTableModule,
    NzGridModule,
    PaddingZerosPipe,
    NzFormModule,
    ReactiveFormsModule,
    NzSelectModule,
    NzColResponsiveSizesDirective,
    NzInputModule,
    NzInputNumberModule,
    NzSpinModule,
    NzDescriptionsModule
  ]
})
export class EstablecimientosModule { }
