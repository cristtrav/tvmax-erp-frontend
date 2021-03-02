import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaTiposdomiciliosComponent } from './vista-tiposdomicilios/vista-tiposdomicilios.component';
import { DetalleTipodomicilioComponent } from './detalle-tipodomicilio/detalle-tipodomicilio.component';

const routes: Routes = [
  { path: '', component: VistaTiposdomiciliosComponent },
  { path: ':id', component: DetalleTipodomicilioComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TiposdomiciliosRoutingModule { }
