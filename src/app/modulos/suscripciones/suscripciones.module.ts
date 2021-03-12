import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuscripcionesRoutingModule } from './suscripciones-routing.module';
import { ContenidoVistaSuscripcionesComponent } from './contenido-vista-suscripciones/contenido-vista-suscripciones.component';
import { FormSuscripcionComponent } from './form-suscripcion/form-suscripcion.component';
import { IconsProviderModule } from './../../icons-provider.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@NgModule({
  declarations: [ContenidoVistaSuscripcionesComponent, FormSuscripcionComponent],
  imports: [
    CommonModule,
    SuscripcionesRoutingModule,
    IconsProviderModule,
    NzButtonModule,
    NzTableModule,
    NzDividerModule,
    NzFormModule,
    NzInputNumberModule,
    NzInputModule,
    FormsModule,
    ReactiveFormsModule,
    NzSelectModule,
    NzDatePickerModule,
    NzCheckboxModule,
    NzSpaceModule,
    NzTagModule,
    NzPopconfirmModule,
    NzToolTipModule
  ],
  exports: [ContenidoVistaSuscripcionesComponent, FormSuscripcionComponent]
})
export class SuscripcionesModule { }
