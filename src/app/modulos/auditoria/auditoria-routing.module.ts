import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaAuditoriaComponent } from './vista-auditoria/vista-auditoria.component';

const routes: Routes = [
  { path: '', component: VistaAuditoriaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuditoriaRoutingModule { }
