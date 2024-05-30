import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaTimbradosComponent } from './vista-timbrados/vista-timbrados.component';
import { DetalleTimbradoComponent } from './detalle-timbrado/detalle-timbrado.component';
import { canAccessFn } from '@global-auth/can-access-fn.guard';

const routes: Routes = [
  { path: '', component: VistaTimbradosComponent },
  {
    path: ':idtimbrado',
    component: DetalleTimbradoComponent,
    data: {idfuncionalidad: 245, name: 'Timbrados' },
    canActivate: [canAccessFn]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimbradosRoutingModule { }
