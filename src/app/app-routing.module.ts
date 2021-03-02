import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/welcome'},
  { path: 'grupos', loadChildren: () => import('./modulos/grupos/grupos.module').then(m => m.GruposModule)},
  { path: 'servicios', loadChildren: () => import('./modulos/servicios/servicios.module').then(m => m.ServiciosModule)},
  { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule)},
  { path: 'departamentos', loadChildren: () => import('./modulos/departamentos/departamentos.module').then(m => m.DepartamentosModule)},
  { path: 'distritos', loadChildren: () => import('./modulos/distritos/distritos.module').then(m => m.DistritosModule) },
  { path: 'barrios', loadChildren: () => import ('./modulos/barrios/barrios.module').then(m => m.BarriosModule)}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
