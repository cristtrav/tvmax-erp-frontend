import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PosMovilRoutingModule } from './pos-movil-routing.module';
import { VistaPosMovilComponent } from './pages/vista-pos-movil/vista-pos-movil.component';
import { WorkspaceLayoutModule } from '@shared/workspace-layout';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { DetallesClienteComponent } from './components/detalles-cliente/detalles-cliente.component';
import { PasoClienteComponent } from './components/paso-cliente/paso-cliente.component';
import { PasoItemsComponent } from './components/paso-items/paso-items.component';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { SeleccionCuotaComponent } from './components/seleccion-cuota/seleccion-cuota.component';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { SeleccionServicioComponent } from './components/seleccion-servicio/seleccion-servicio.component';
import { PasoCabeceraComponent } from './components/paso-cabecera/paso-cabecera.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { PasoResultadoComponent } from './components/paso-resultado/paso-resultado.component';
import { NzResultModule } from 'ng-zorro-antd/result';

@NgModule({
  declarations: [
    VistaPosMovilComponent,
    DetallesClienteComponent,
    PasoClienteComponent,
    PasoItemsComponent,
    SeleccionCuotaComponent,
    SeleccionServicioComponent,
    PasoCabeceraComponent,
    PasoResultadoComponent
  ],
  imports: [
    CommonModule,
    PosMovilRoutingModule,
    WorkspaceLayoutModule,
    IconsProviderModule,
    NzBreadCrumbModule,
    NzStepsModule,
    NzInputModule,
    NzGridModule,
    NzButtonModule,
    NzSelectModule,
    FormsModule,
    NzDescriptionsModule,
    NzTypographyModule,
    NzListModule,
    NzModalModule,
    NzAlertModule,
    NzSpinModule,
    NzCollapseModule,
    NzSpaceModule,
    NzTagModule,
    NzBadgeModule,
    NzTableModule,
    NzEmptyModule,
    NzMessageModule,
    ReactiveFormsModule,
    NzFormModule,
    NzDatePickerModule,
    NzStatisticModule,
    NzResultModule
  ]
})
export class PosMovilModule { }
