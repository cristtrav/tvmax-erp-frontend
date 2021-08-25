import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TiposdomiciliosRoutingModule } from './tiposdomicilios-routing.module';
import { VistaTiposdomiciliosComponent } from './vista-tiposdomicilios/vista-tiposdomicilios.component';
import { DetalleTipodomicilioComponent } from './detalle-tipodomicilio/detalle-tipodomicilio.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { IconsProviderModule } from './../../icons-provider.module';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';


@NgModule({
  declarations: [VistaTiposdomiciliosComponent, DetalleTipodomicilioComponent],
  imports: [
    CommonModule,
    TiposdomiciliosRoutingModule,
    NzBreadCrumbModule,
    NzPopconfirmModule,
    NzButtonModule,
    NzTableModule,
    NzInputModule,
    NzInputNumberModule,
    IconsProviderModule,
    NzFormModule,
    FormsModule,
    ReactiveFormsModule,
    NzGridModule,
    NzNotificationModule,
    NzDividerModule,
    NzSpinModule,
    NzToolTipModule
  ]
})
export class TiposdomiciliosModule { }
