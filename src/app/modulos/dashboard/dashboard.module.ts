import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { VistaDashboardComponent } from './vista-dashboard/vista-dashboard.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { SharedModule } from '../shared/shared.module';

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
    NzGridModule,
    NzButtonModule,
    NzTypographyModule,
    NzBadgeModule,
    NzAvatarModule,
    SharedModule
  ]
})
export class DashboardModule { }
