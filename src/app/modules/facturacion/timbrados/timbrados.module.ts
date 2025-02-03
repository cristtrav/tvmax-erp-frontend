import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimbradosRoutingModule } from './timbrados-routing.module';
import { VistaTimbradosComponent } from './pages/vista-timbrados/vista-timbrados.component';
import { DetalleTimbradoComponent } from './pages/detalle-timbrado/detalle-timbrado.component';
import { VistaTimbradoTalonariosComponent } from './pages/vista-timbrado-talonarios/vista-timbrado-talonarios.component';
import { DetalleTimbradoTalonarioComponent } from './pages/detalle-timbrado-talonario/detalle-timbrado-talonario.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzFormModule } from 'ng-zorro-antd/form';
import { WorkspaceLayoutModule } from '@shared/workspace-layout';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { TalonariosModule } from '@modules/talonarios/talonarios.module';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzColResponsiveSizesDirective } from '@global-directives/responsive/nz-col-responsive-sizes.directive';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { ReactiveFormsModule } from '@angular/forms';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';


@NgModule({
  declarations: [
    VistaTimbradosComponent,
    DetalleTimbradoComponent,
    VistaTimbradoTalonariosComponent,
    DetalleTimbradoTalonarioComponent
  ],
  imports: [
    CommonModule,
    TimbradosRoutingModule,
    NzBreadCrumbModule,
    IconsProviderModule,
    NzButtonModule,
    NzGridModule,
    NzTableModule,
    NzFormModule,
    WorkspaceLayoutModule,
    NzTypographyModule,
    NzTagModule,
    NzToolTipModule,
    TalonariosModule,
    NzDividerModule,
    NzColResponsiveSizesDirective,
    NzInputModule,
    NzInputNumberModule,
    NzDatePickerModule,
    ReactiveFormsModule,
    NzCheckboxModule,
    NzSpinModule
  ]
})
export class TimbradosModule { }
