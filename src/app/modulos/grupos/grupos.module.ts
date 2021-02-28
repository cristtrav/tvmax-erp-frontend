import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GruposRoutingModule } from './grupos-routing.module';
import { VistaGruposComponent } from './vista-grupos/vista-grupos.component';
import { NzBreadCrumbModule} from 'ng-zorro-antd/breadcrumb'
import { IconsProviderModule } from '../../icons-provider.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { DetalleGrupoComponent } from './detalle-grupo/detalle-grupo.component';
import { NzTableModule} from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

@NgModule({
  declarations: [VistaGruposComponent, DetalleGrupoComponent],
  imports: [
    CommonModule,
    GruposRoutingModule,
    NzBreadCrumbModule,
    IconsProviderModule,
    NzButtonModule,
    NzTableModule,
    NzToolTipModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputNumberModule,
    NzInputModule,
    NzNotificationModule,
    NzPopconfirmModule
  ]
})
export class GruposModule { }
