import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGenerarDteLotesComponent } from './pages/form-generar-dte-lotes/form-generar-dte-lotes.component';
import { GenerarDteLotesRouting } from './generar-dte-lotes-routing.module';
import { WorkspaceLayoutModule } from '@shared/workspace-layout';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ReactiveFormsModule } from '@angular/forms';
import { NzColResponsiveSizesDirective } from "@global-directives/responsive/nz-col-responsive-sizes.directive";
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { IconsProviderModule } from 'src/app/icons-provider.module';

@NgModule({
  declarations: [
    FormGenerarDteLotesComponent
  ],
  imports: [
    CommonModule,
    GenerarDteLotesRouting,
    WorkspaceLayoutModule,
    NzFormModule,
    NzButtonModule,
    NzInputModule,
    ReactiveFormsModule,
    NzColResponsiveSizesDirective,
    NzDatePickerModule,
    NzSelectModule,
    IconsProviderModule
]
})
export class GenerarDteLotesModule { }
