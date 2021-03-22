import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './util/auth.guard';
import { AppComponent } from './app.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/app/welcome' },
  { path: 'login', loadChildren: () => import('./modulos/login/login.module').then(m => m.LoginModule), canActivate: [AuthGuard] },
  {
    path: 'app', component: AppComponent, canActivate: [AuthGuard] ,children: [
      { path: 'grupos', loadChildren: () => import('./modulos/grupos/grupos.module').then(m => m.GruposModule) },
      { path: 'servicios', loadChildren: () => import('./modulos/servicios/servicios.module').then(m => m.ServiciosModule) },
      { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule), canActivate: [AuthGuard] },
      { path: 'departamentos', loadChildren: () => import('./modulos/departamentos/departamentos.module').then(m => m.DepartamentosModule) },
      { path: 'distritos', loadChildren: () => import('./modulos/distritos/distritos.module').then(m => m.DistritosModule) },
      { path: 'barrios', loadChildren: () => import('./modulos/barrios/barrios.module').then(m => m.BarriosModule) },
      { path: 'tiposdomicilios', loadChildren: () => import('./modulos/tiposdomicilios/tiposdomicilios.module').then(m => m.TiposdomiciliosModule) },
      { path: 'cobradores', loadChildren: () => import('./modulos/cobradores/cobradores.module').then(m => m.CobradoresModule) },
      { path: 'clientes', loadChildren: () => import('./modulos/clientes/clientes.module').then(m => m.ClientesModule) },
      { path: 'usuarios', loadChildren: () => import('./modulos/usuarios/usuarios.module').then(m => m.UsuariosModule) }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
