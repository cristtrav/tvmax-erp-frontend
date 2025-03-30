import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { FormAjusteExistenciaComponent } from './components/form-ajuste-existencia/form-ajuste-existencia.component';
import { TablaAjustesExistenciasComponent } from './components/tabla-ajustes-existencias/tabla-ajustes-existencias.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzColResponsiveSizesDirective } from '@global-directives/responsive/nz-col-responsive-sizes.directive';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { RouterModule } from '@angular/router';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

@NgModule({
  declarations: [
    FormAjusteExistenciaComponent,
    TablaAjustesExistenciasComponent
  ],
  imports: [
    CommonModule,
    IconsProviderModule,
    NzButtonModule,
    NzGridModule,
    NzToolTipModule,
    NzTableModule,
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzColResponsiveSizesDirective,
    NzSelectModule,
    RouterModule,
    NzSwitchModule
  ],
  exports: [
    //ContenidoVistaAjusteExistenciasComponent,
    FormAjusteExistenciaComponent,
    TablaAjustesExistenciasComponent
  ]
})
export class AjustesExistenciasModule { }
