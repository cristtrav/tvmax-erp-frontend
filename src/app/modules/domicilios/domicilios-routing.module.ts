import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaDomiciliosComponent } from './pages/vista-domicilios/vista-domicilios.component';
import { DetalleDomicilioComponent } from './pages/detalle-domicilio/detalle-domicilio.component';

const routes: Routes = [
  { path: '', component: VistaDomiciliosComponent },
  { path: ':iddomicilio', component: DetalleDomicilioComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DomiciliosRoutingModule { }
