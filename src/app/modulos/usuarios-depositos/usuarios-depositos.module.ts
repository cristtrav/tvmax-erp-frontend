import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuariosDepositosRoutingModule } from './usuarios-depositos-routing.module';
import { DetalleUsuarioDepositoComponent } from './detalle-usuario-deposito/detalle-usuario-deposito.component';
import { VistaUsuariosDepositosComponent } from './vista-usuarios-depositos/vista-usuarios-depositos.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzTagModule } from 'ng-zorro-antd/tag';

@NgModule({
  declarations: [
    DetalleUsuarioDepositoComponent,
    VistaUsuariosDepositosComponent
  ],
  imports: [
    CommonModule,
    UsuariosDepositosRoutingModule,
    NzBreadCrumbModule,
    IconsProviderModule,
    NzGridModule,
    NzButtonModule,
    NzTableModule,
    NzToolTipModule,
    NzInputModule,
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NzInputNumberModule,
    NzSelectModule,
    NzSpinModule,
    NzModalModule,
    NzTypographyModule,
    NzTagModule
  ]
})
export class UsuariosDepositosModule { }
