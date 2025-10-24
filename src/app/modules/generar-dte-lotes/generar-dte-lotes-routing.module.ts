import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FormGenerarDteLotesComponent } from "./pages/form-generar-dte-lotes/form-generar-dte-lotes.component";

const routes: Routes = [
  { path: '', component: FormGenerarDteLotesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GenerarDteLotesRouting { }