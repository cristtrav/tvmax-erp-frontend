import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaDashboardComponent } from './vista-dashboard/vista-dashboard.component';

const routes: Routes = [
  {path: '', component: VistaDashboardComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
