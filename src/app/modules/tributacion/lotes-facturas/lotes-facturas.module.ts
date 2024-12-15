import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LotesFacturasRoutingModule } from './lotes-facturas-routing.module';
import { VistaLotesFacturasComponent } from './pages/vista-lotes-facturas/vista-lotes-facturas.component';
import { WorkspaceLayoutModule } from "../../../shared/workspace-layout/workspace-layout.module";
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { PaddingZerosPipe } from 'src/app/global/pipes/padding-zeros.pipe';


@NgModule({
  declarations: [
    VistaLotesFacturasComponent
  ],
  imports: [
    CommonModule,
    LotesFacturasRoutingModule,
    WorkspaceLayoutModule,
    NzBreadCrumbModule,
    NzGridModule,
    IconsProviderModule,
    NzTableModule,
    NzButtonModule,
    NzTypographyModule,
    NzTagModule,
    NzToolTipModule,
    PaddingZerosPipe,
    NzTypographyModule
  ]
})
export class LotesFacturasModule { }
