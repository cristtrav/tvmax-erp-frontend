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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { VistaPremiosComponent } from './vista-premios/vista-premios.component';
import { DetallePremioComponent } from './detalle-premio/detalle-premio.component';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { ParticipantesComponent } from './participantes/participantes.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { SortearComponent } from './sortear/sortear.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { PaddingZerosPipe } from '@util/pipes/padding-zeros.pipe';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { HideCiPipe } from '@util/pipes/hide-ci.pipe';
import { GanadoresComponent } from './ganadores/ganadores.component';
import { NzListModule } from 'ng-zorro-antd/list';
import { ExclusionesComponent } from './exclusiones/exclusiones.component';


@NgModule({
  declarations: [
    VistaSorteosComponent,
    DetalleSorteoComponent,
    VistaPremiosComponent,
    DetallePremioComponent,
    ParticipantesComponent,
    SortearComponent,
    GanadoresComponent,
    ExclusionesComponent
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
    NzInputNumberModule,
    NzTagModule,
    NzTypographyModule,
    NzModalModule,
    NzDatePickerModule,
    NzSpaceModule,
    FormsModule,
    NzImageModule,
    NzSelectModule,
    NzSpinModule,
    PaddingZerosPipe,
    NzAlertModule,
    HideCiPipe,
    NzListModule
  ]
})
export class SorteosModule { }
