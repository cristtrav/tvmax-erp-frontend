import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CobrosRoutingModule } from './cobros-routing.module';
import { VistaCobrosComponent } from './vista-cobros/vista-cobros.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { TablaDetalleVentasCobrosComponent } from './tabla-detalle-ventas-cobros/tabla-detalle-ventas-cobros.component';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { FormFiltrosCobrosComponent } from './form-filtros-cobros/form-filtros-cobros.component';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDividerModule } from 'ng-zorro-antd/divider';

@NgModule({
  declarations: [
    VistaCobrosComponent,
    TablaDetalleVentasCobrosComponent,
    FormFiltrosCobrosComponent
  ],
  imports: [
    CommonModule,
    CobrosRoutingModule,
    NzBreadCrumbModule,
    IconsProviderModule,
    NzTableModule,
    NzDescriptionsModule,
    NzTypographyModule,
    NzTagModule,
    NzSpaceModule,
    NzButtonModule,
    NzInputModule,
    FormsModule,
    NzBadgeModule,
    NzGridModule,
    NzDrawerModule,
    NzDatePickerModule,
    NzToolTipModule,
    NzSelectModule
  ]
})
export class CobrosModule { }
