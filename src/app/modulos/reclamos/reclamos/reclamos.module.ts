import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReclamosRoutingModule } from './reclamos-routing.module';
import { VistaReclamosComponent } from './vista-reclamos/vista-reclamos.component';
import { DetalleReclamoComponent } from './detalle-reclamo/detalle-reclamo.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzColResponsiveSizesDirective } from 'src/app/global/directives/responsive/nz-col-responsive-sizes.directive';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { LoadingStatusPipe } from '@util/pipes/loading-status.pipe';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { BuscadorMotivosComponent } from './detalle-reclamo/buscador-motivos/buscador-motivos.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { FormFiltroReclamosComponent } from './form-filtro-reclamos/form-filtro-reclamos.component';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { IdsuscripcionToEstadoPipe } from '../pipes/idsuscripcion-to-estado.pipe';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';


@NgModule({
  declarations: [
    VistaReclamosComponent,
    DetalleReclamoComponent,
    BuscadorMotivosComponent,
    FormFiltroReclamosComponent,
    IdsuscripcionToEstadoPipe
  ],
  imports: [
    CommonModule,
    ReclamosRoutingModule,
    NzBreadCrumbModule,
    NzGridModule,
    NzButtonModule,
    NzInputModule,
    IconsProviderModule,
    FormsModule,
    NzToolTipModule,
    NzColResponsiveSizesDirective,
    NzDatePickerModule,
    NzFormModule,
    NzSelectModule,
    ReactiveFormsModule,    
    LoadingStatusPipe,
    NzTypographyModule,
    NzTagModule,
    NzTableModule,
    NzModalModule,
    NzDropDownModule,
    NzSpinModule,
    ReactiveFormsModule,
    ScrollingModule,
    NzAlertModule,
    NzDescriptionsModule,
    NzDrawerModule,
    NzBadgeModule,
    NzSpaceModule,
    NzTabsModule,
    NzCollapseModule,
    NzColResponsiveSizesDirective
  ]
})
export class ReclamosModule { }
