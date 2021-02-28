import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'grupos', loadChildren: () => import('./modulos/grupos/grupos.module').then(m => m.GruposModule), data: {breadcrumb: 'Grupos'}},
  { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule) , data: {breadcrumb: 'Dashboard'}},
  { path: '', pathMatch: 'full', redirectTo: '/welcome'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
