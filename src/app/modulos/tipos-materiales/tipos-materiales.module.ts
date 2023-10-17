import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TiposMaterialesRoutingModule } from './tipos-materiales-routing.module';
import { VistaTiposMaterialesComponent } from './vista-tipos-materiales/vista-tipos-materiales.component';
import { DetalleTipoMaterialComponent } from './detalle-tipo-material/detalle-tipo-material.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTableModule } from 'ng-zorro-antd/table';


@NgModule({
  declarations: [
    VistaTiposMaterialesComponent,
    DetalleTipoMaterialComponent
  ],
  imports: [
    CommonModule,
    TiposMaterialesRoutingModule,
    NzBreadCrumbModule,
    IconsProviderModule,
    NzButtonModule,
    NzGridModule,
    NzTableModule
  ]
})
export class TiposMaterialesModule { }
