import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 

import { VentasRoutingModule } from './ventas-routing.module';
import { VistaVentasComponent } from './vista-ventas/vista-ventas.component';
import { IconsProviderModule } from '../../icons-provider.module';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { DetalleVentaComponent } from './detalle-venta/detalle-venta.component';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzListModule } from 'ng-zorro-antd/list'; 
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzNotificationModule } from 'ng-zorro-antd/notification';

@NgModule({
  declarations: [
    VistaVentasComponent,
    DetalleVentaComponent
  ],
  imports: [
    CommonModule,
    VentasRoutingModule,
    NzBreadCrumbModule,
    IconsProviderModule,
    NzButtonModule,
    NzGridModule,
    NzInputModule,
    NzDatePickerModule,
    NzFormModule,
    NzSelectModule,
    NzInputNumberModule,
    NzAlertModule,
    NzDividerModule,
    NzTagModule,
    NzSpaceModule,
    NzToolTipModule,
    FormsModule,
    ReactiveFormsModule,
    NzSpinModule,
    NzTableModule,
    NzModalModule,
    NzDropDownModule,
    NzListModule,
    NzMenuModule,
    NzCollapseModule,
    NzTypographyModule,
    NzBadgeModule,
    NzPopconfirmModule,
    NzPopoverModule,
    NzNotificationModule
  ]
})
export class VentasModule { }
