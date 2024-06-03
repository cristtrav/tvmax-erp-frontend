import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceLayoutModule } from '@shared/workspace-layout';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { VistaDashboardComponent } from './pages/vista-dashboard/vista-dashboard.component';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { ReclamosCardComponent } from './components/reclamos-card/reclamos-card.component';

@NgModule({
  declarations: [
    VistaDashboardComponent,
    ReclamosCardComponent
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
    NzStatisticModule,
    WorkspaceLayoutModule
  ]
})
export class DashboardModule { }
