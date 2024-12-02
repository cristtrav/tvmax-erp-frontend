import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaPosMovilComponent } from './pages/vista-pos-movil/vista-pos-movil.component';

const routes: Routes = [
  { path: '', component: VistaPosMovilComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PosMovilRoutingModule { }
