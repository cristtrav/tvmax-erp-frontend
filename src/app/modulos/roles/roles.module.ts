import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesRoutingModule } from './roles-routing.module';
import { DetalleRolComponent } from './detalle-rol/detalle-rol.component';
import { VistaRolesComponent } from './vista-roles/vista-roles.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';


@NgModule({
  declarations: [
    DetalleRolComponent,
    VistaRolesComponent
  ],
  imports: [
    CommonModule,
    RolesRoutingModule,
    NzBreadCrumbModule,
    IconsProviderModule,
    NzButtonModule,
    NzTableModule,
    NzGridModule,
    NzSpinModule,
    NzFormModule,
    NzInputNumberModule,
    NzInputModule,
    ReactiveFormsModule,
    NzNotificationModule,
    NzModalModule,
    NzToolTipModule,
    FormsModule
  ]
})
export class RolesModule { }
