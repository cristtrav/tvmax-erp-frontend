import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExportarCsvRoutingModule } from './exportar-csv-routing.module';
import { WorkspaceLayoutModule } from '@shared/workspace-layout';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzColResponsiveSizesDirective } from '@global-directives/responsive/nz-col-responsive-sizes.directive';
import { NzFormModule } from 'ng-zorro-antd/form';
import { ReactiveFormsModule } from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { VistaExportarCsvComponent } from './pages/vista-exportar-csv/vista-exportar-csv.component';


@NgModule({
  declarations: [
    VistaExportarCsvComponent
  ],
  imports: [
    CommonModule,
    ExportarCsvRoutingModule,
    WorkspaceLayoutModule,
    NzBreadCrumbModule,
    IconsProviderModule,
    NzGridModule,
    NzCardModule,
    NzAvatarModule,
    NzColResponsiveSizesDirective,
    NzFormModule,
    ReactiveFormsModule,
    NzDatePickerModule,
    NzButtonModule,
    NzSwitchModule,
    NzAlertModule,
    NzSpinModule,
    NzSelectModule,
    NzCheckboxModule,
    NzSpaceModule,
    NzTagModule
  ]
})
export class ExportarCsvModule { }
