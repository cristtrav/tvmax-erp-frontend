import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaTimbradosComponent } from './vista-timbrados/vista-timbrados.component';
import { DetalleTimbradoComponent } from './detalle-timbrado/detalle-timbrado.component';

const routes: Routes = [
  { path: '', component: VistaTimbradosComponent },
  { path: ':idtimbrado', component: DetalleTimbradoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimbradosRoutingModule { }
