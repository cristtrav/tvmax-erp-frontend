import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaDistritosComponent } from './vista-distritos/vista-distritos.component';
import { DetalleDistritoComponent } from './detalle-distrito/detalle-distrito.component';

const routes: Routes = [
  { path: '', component: VistaDistritosComponent },
  { path: ':id', component: DetalleDistritoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DistritosRoutingModule { }
