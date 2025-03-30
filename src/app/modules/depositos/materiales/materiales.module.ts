import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialesRoutingModule } from './materiales-routing.module';
import { VistaMaterialesComponent } from './pages/vista-materiales/vista-materiales.component';
import { DetalleMaterialComponent } from './pages/detalle-material/detalle-material.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { FormFiltroMaterialesComponent } from './components/form-filtro-materiales/form-filtro-materiales.component';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { WorkspaceLayoutModule } from '@shared/workspace-layout';
import { NzColResponsiveSizesDirective } from '@global-directives/responsive/nz-col-responsive-sizes.directive';
import { VistaAjustesExistenciasMaterialesComponent } from './pages/vista-ajustes-existencias-materiales/vista-ajustes-existencias-materiales.component';
import { AjustesExistenciasModule } from '../ajustes-existencias/ajustes-existencias.module';
import { DetalleAjusteExistenciaMaterialComponent } from './pages/detalle-ajuste-existencia-material/detalle-ajuste-existencia-material.component';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { CantidadMaterialPipe } from './pipes/cantidad-material.pipe';


@NgModule({
  declarations: [
    VistaMaterialesComponent,
    DetalleMaterialComponent,
    FormFiltroMaterialesComponent,
    VistaAjustesExistenciasMaterialesComponent,
    DetalleAjusteExistenciaMaterialComponent,
    CantidadMaterialPipe
  ],
  imports: [
    CommonModule,
    MaterialesRoutingModule,
    NzBreadCrumbModule,
    IconsProviderModule,
    NzGridModule,
    NzButtonModule,
    ReactiveFormsModule,
    NzTableModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzSelectModule,
    NzRadioModule,
    NzTagModule,
    NzToolTipModule,
    FormsModule,
    NzCheckboxModule,
    NzSpaceModule,
    NzDrawerModule,
    NzBadgeModule,
    NzTabsModule,
    NzDescriptionsModule,
    WorkspaceLayoutModule,
    NzColResponsiveSizesDirective,
    AjustesExistenciasModule,
    NzDividerModule
  ]
})
export class MaterialesModule { }
