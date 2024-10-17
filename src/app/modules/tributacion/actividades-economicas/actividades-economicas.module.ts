import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActividadesEconomicasRoutingModule } from './actividades-economicas-routing.module';
import { WorkspaceLayoutModule } from '@shared/workspace-layout';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { VistaActividadesEconimicasComponent } from './pages/vista-actividades-econimicas/vista-actividades-econimicas.component';
import { DetalleActividadEconimicaComponent } from './pages/detalle-actividad-econimica/detalle-actividad-econimica.component';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzColResponsiveSizesDirective } from '@global-directives/responsive/nz-col-responsive-sizes.directive';


@NgModule({
  declarations: [
    VistaActividadesEconimicasComponent,
    DetalleActividadEconimicaComponent
  ],
  imports: [
    CommonModule,
    ActividadesEconomicasRoutingModule,
    WorkspaceLayoutModule,
    NzBreadCrumbModule,
    IconsProviderModule,
    NzGridModule,
    NzTableModule,
    NzButtonModule,
    NzToolTipModule,
    ReactiveFormsModule,
    NzFormModule,
    NzSpinModule,
    NzInputModule,
    NzInputNumberModule,
    NzColResponsiveSizesDirective
  ]
})
export class ActividadesEconomicasModule { }
