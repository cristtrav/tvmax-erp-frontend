import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaExportarCsvComponent } from './pages/vista-exportar-csv/vista-exportar-csv.component';

const routes: Routes = [
  { path: '', component: VistaExportarCsvComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExportarCsvRoutingModule { }
