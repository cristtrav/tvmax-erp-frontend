import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaTributacionComponent } from './pages/vista-tributacion/vista-tributacion.component';

const routes: Routes = [
  { path: '', component: VistaTributacionComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TributacionRoutingModule { }
