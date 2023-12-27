import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SorteosRoutingModule } from './sorteos-routing.module';
import { VistaSorteosComponent } from './vista-sorteos/vista-sorteos.component';
import { DetalleSorteoComponent } from './detalle-sorteo/detalle-sorteo.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';


@NgModule({
  declarations: [
    VistaSorteosComponent,
    DetalleSorteoComponent
  ],
  imports: [
    CommonModule,
    SorteosRoutingModule,
    NzBreadCrumbModule,
    IconsProviderModule,
    NzTableModule,
    NzButtonModule,
    NzGridModule,
    NzToolTipModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule
  ]
})
export class SorteosModule { }
