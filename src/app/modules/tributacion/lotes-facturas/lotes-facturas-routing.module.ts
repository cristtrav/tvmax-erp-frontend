import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaLotesFacturasComponent } from './pages/vista-lotes-facturas/vista-lotes-facturas.component';

const routes: Routes = [
  { path: '', component: VistaLotesFacturasComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LotesFacturasRoutingModule { }
