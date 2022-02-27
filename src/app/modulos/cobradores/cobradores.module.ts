import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CobradoresRoutingModule } from './cobradores-routing.module';
import { VistaCobradoresComponent } from './vista-cobradores/vista-cobradores.component';
import { DetalleCobradorComponent } from './detalle-cobrador/detalle-cobrador.component';
import { IconsProviderModule } from './../../icons-provider.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzSpaceModule } from 'ng-zorro-antd/space';

@NgModule({
  declarations: [VistaCobradoresComponent, DetalleCobradorComponent],
  imports: [
    CommonModule,
    CobradoresRoutingModule,
    IconsProviderModule,
    NzButtonModule,
    NzBreadCrumbModule,
    NzTableModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    FormsModule,
    ReactiveFormsModule,
    NzDividerModule,
    NzPopconfirmModule,
    NzSelectModule,
    NzCheckboxModule,
    NzNotificationModule,
    NzSpinModule,
    NzToolTipModule,
    NzSpaceModule
  ]
})
export class CobradoresModule { }
