import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TalonariosRoutingModule } from './talonarios-routing.module';
import { VistaTalonariosComponent } from './pages/vista-talonarios/vista-talonarios.component';
import { DetalleTalonarioComponent } from './pages/detalle-talonario/detalle-talonario.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { IconsProviderModule } from '../../icons-provider.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { WorkspaceLayoutModule } from '@shared/workspace-layout';
import { NzColResponsiveSizesDirective } from '@global-directives/responsive/nz-col-responsive-sizes.directive';
import { PaddingZerosPipe } from 'src/app/global/pipes/padding-zeros.pipe';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { FindTimbradoPipe } from './pipes/find-timbrado.pipe';
import { IsTimbradoElectronicoPipe } from './pipes/id-timbrado-electronico.pipe';
import { TablaTalonariosComponent } from './components/tabla-talonarios/tabla-talonarios.component';
import { FormTalonarioComponent } from './components/form-talonario/form-talonario.component';

@NgModule({
  declarations: [
    VistaTalonariosComponent,
    DetalleTalonarioComponent,
    FindTimbradoPipe,
    IsTimbradoElectronicoPipe,
    TablaTalonariosComponent,
    FormTalonarioComponent
  ],
  imports: [
    CommonModule,
    TalonariosRoutingModule,
    NzBreadCrumbModule,
    IconsProviderModule,
    NzButtonModule,
    NzGridModule,
    NzInputNumberModule,
    NzFormModule,
    NzInputModule,
    NzDatePickerModule,
    NzCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    NzNotificationModule,
    NzTableModule,
    NzSpaceModule,
    NzToolTipModule,
    NzSpinModule,
    NzPopconfirmModule,
    NzTypographyModule,
    NzTagModule,
    NzModalModule,
    NzSelectModule,
    WorkspaceLayoutModule,
    NzColResponsiveSizesDirective,
    PaddingZerosPipe,
    NzDividerModule
  ],
  exports: [
    TablaTalonariosComponent,
    FormTalonarioComponent
  ]
})
export class TalonariosModule { }
