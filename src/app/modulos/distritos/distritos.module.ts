import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DistritosRoutingModule } from './distritos-routing.module';
import { VistaDistritosComponent } from './vista-distritos/vista-distritos.component';
import { DetalleDistritoComponent } from './detalle-distrito/detalle-distrito.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { IconsProviderModule } from './../../icons-provider.module';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';


@NgModule({
  declarations: [VistaDistritosComponent, DetalleDistritoComponent],
  imports: [
    CommonModule,
    DistritosRoutingModule,
    NzButtonModule,
    NzBreadCrumbModule,
    IconsProviderModule,
    NzGridModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzSelectModule,
    NzNotificationModule,
    NzDividerModule,
    NzPopconfirmModule
  ]
})
export class DistritosModule { }
