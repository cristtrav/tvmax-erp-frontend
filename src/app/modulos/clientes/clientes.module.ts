import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientesRoutingModule } from './clientes-routing.module';
import { VistaClientesComponent } from './vista-clientes/vista-clientes.component';
import { DetalleClienteComponent } from './detalle-cliente/detalle-cliente.component';
import { IconsProviderModule } from './../../icons-provider.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzNotificationModule } from 'ng-zorro-antd/notification';


@NgModule({
  declarations: [VistaClientesComponent, DetalleClienteComponent],
  imports: [
    CommonModule,
    ClientesRoutingModule,
    IconsProviderModule,
    NzButtonModule,
    NzGridModule,
    NzTableModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    FormsModule,
    ReactiveFormsModule,
    NzPopconfirmModule,
    NzDividerModule,
    NzSelectModule,
    NzBreadCrumbModule,
    NzNotificationModule
  ]
})
export class ClientesModule { }
