import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaCobradoresComponent } from './vista-cobradores/vista-cobradores.component';
import { DetalleCobradorComponent } from './detalle-cobrador/detalle-cobrador.component';

const routes: Routes = [
  { path: '', component: VistaCobradoresComponent },
  { path: ':id', component: DetalleCobradorComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CobradoresRoutingModule { }
