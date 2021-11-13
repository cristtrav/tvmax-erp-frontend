import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TablaCuotasComponent } from './tabla-cuotas/tabla-cuotas.component';
import { ContenidoVistaCuotasComponent } from './contenido-vista-cuotas/contenido-vista-cuotas.component';
import { FormCuotaComponent } from './form-cuota/form-cuota.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { IconsProviderModule } from './../../icons-provider.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTypographyModule} from 'ng-zorro-antd/typography';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { CuotasRoutingModule } from './cuotas-routing.module';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSpaceModule } from 'ng-zorro-antd/space';

@NgModule({
  declarations: [TablaCuotasComponent, ContenidoVistaCuotasComponent, FormCuotaComponent],
  imports: [
    CommonModule,
    CuotasRoutingModule,
    NzButtonModule,
    IconsProviderModule,
    NzTableModule,
    NzTabsModule,
    NzTypographyModule,
    NzDividerModule,
    NzFormModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzSelectModule,
    NzDatePickerModule,
    NzInputNumberModule,
    NzToolTipModule,
    NzPopconfirmModule,
    NzSpinModule,
    NzSpaceModule
  ],
  exports: [ContenidoVistaCuotasComponent, FormCuotaComponent]
})
export class CuotasModule { }
