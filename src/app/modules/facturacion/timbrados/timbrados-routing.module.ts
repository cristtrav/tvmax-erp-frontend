import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaTimbradosComponent } from './pages/vista-timbrados/vista-timbrados.component';
import { DetalleTimbradoComponent } from './pages/detalle-timbrado/detalle-timbrado.component';
import { VistaTimbradoTalonariosComponent } from './pages/vista-timbrado-talonarios/vista-timbrado-talonarios.component';
import { DetalleTimbradoTalonarioComponent } from './pages/detalle-timbrado-talonario/detalle-timbrado-talonario.component';

const routes: Routes = [
  { path: '', component: VistaTimbradosComponent },
  { path: ':nrotimbrado', component: DetalleTimbradoComponent },
  { path: ':nrotimbrado/talonarios', component: VistaTimbradoTalonariosComponent },
  { path: ':nrotimbrado/talonarios/:idtalonario', component: DetalleTimbradoTalonarioComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimbradosRoutingModule { }
