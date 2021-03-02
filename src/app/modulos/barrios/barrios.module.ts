import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BarriosRoutingModule } from './barrios-routing.module';
import { VistaBarriosComponent } from './vista-barrios/vista-barrios.component';
import { DetalleBarrioComponent } from './detalle-barrio/detalle-barrio.component';

import { IconsProviderModule } from './../../icons-provider.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';


@NgModule({
  declarations: [VistaBarriosComponent, DetalleBarrioComponent],
  imports: [
    CommonModule,
    BarriosRoutingModule,
    NzButtonModule,
    NzBreadCrumbModule,
    NzTableModule,
    NzInputNumberModule,
    NzInputModule,
    NzFormModule,
    NzSelectModule,
    NzGridModule,
    NzDividerModule,
    FormsModule,
    ReactiveFormsModule,
    IconsProviderModule,
    NzNotificationModule,
    NzPopconfirmModule
  ]
})
export class BarriosModule { }
