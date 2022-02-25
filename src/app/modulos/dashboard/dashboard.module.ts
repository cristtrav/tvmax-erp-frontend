import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { VistaDashboardComponent } from './vista-dashboard/vista-dashboard.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';


@NgModule({
  declarations: [
    VistaDashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NzBreadCrumbModule,
    IconsProviderModule,
    NzCardModule,
    NzGridModule
  ]
})
export class DashboardModule { }
