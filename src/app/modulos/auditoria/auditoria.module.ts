import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuditoriaRoutingModule } from './auditoria-routing.module';
import { VistaAuditoriaComponent } from './vista-auditoria/vista-auditoria.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { FormFiltroEventoAuditoriaComponent } from './form-filtro-evento-auditoria/form-filtro-evento-auditoria.component';
//import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { TablaDetalleEstadoComponent } from './tabla-detalle-estado/tabla-detalle-estado.component';
import { NzModalModule } from 'ng-zorro-antd/modal';


@NgModule({
  declarations: [
    VistaAuditoriaComponent,
    FormFiltroEventoAuditoriaComponent,
    TablaDetalleEstadoComponent
  ],
  imports: [
    CommonModule,
    AuditoriaRoutingModule,
    NzBreadCrumbModule,
    IconsProviderModule,
    NzTableModule,
    NzToolTipModule,
    NzGridModule,
    NzDescriptionsModule,
    NzTagModule,
  //  NzDrawerModule,
    NzSpaceModule,
    NzBadgeModule,
    NzInputModule,
    FormsModule,
    NzButtonModule,
    NzSelectModule,
    NzDatePickerModule,
    NzCheckboxModule,
    NzModalModule
  ]
})
export class AuditoriaModule { }
