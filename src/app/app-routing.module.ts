import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './util/auth.guard';
import { AppComponent } from './app.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/app/dashboard' },
  { path: 'login', loadChildren: () => import('./modulos/login/login.module').then(m => m.LoginModule), canActivate: [AuthGuard] },
  {
    path: 'app', component: AppComponent, canActivate: [AuthGuard], children: [
      { path: 'grupos', loadChildren: () => import('./modulos/grupos/grupos.module').then(m => m.GruposModule) },
      { path: 'servicios', loadChildren: () => import('./modulos/servicios/servicios.module').then(m => m.ServiciosModule) },
      { path: 'dashboard', loadChildren: () => import('./modulos/dashboard/dashboard.module').then(m=> m.DashboardModule) },
      { path: 'departamentos', loadChildren: () => import('./modulos/departamentos/departamentos.module').then(m => m.DepartamentosModule) },
      { path: 'distritos', loadChildren: () => import('./modulos/distritos/distritos.module').then(m => m.DistritosModule) },
      { path: 'barrios', loadChildren: () => import('./modulos/barrios/barrios.module').then(m => m.BarriosModule) },
      { path: 'clientes', loadChildren: () => import('./modulos/clientes/clientes.module').then(m => m.ClientesModule) },
      { path: 'usuarios', loadChildren: () => import('./modulos/usuarios/usuarios.module').then(m => m.UsuariosModule) },
      { path: 'suscripciones', loadChildren: () => import('./modulos/suscripciones/suscripciones.module').then(m => m.SuscripcionesModule) },
      { path: 'ventas', loadChildren: () => import ('./modulos/ventas/ventas.module').then(m => m.VentasModule)},
      { path: 'timbrados', loadChildren: () => import ('./modulos/timbrados/timbrados.module').then(m => m.TimbradosModule) },
      { path: 'auditoria', loadChildren: () => import('./modulos/auditoria/auditoria.module').then(m => m.AuditoriaModule) },
      { path: 'cobros', loadChildren: () => import('./modulos/cobros/cobros.module').then(m => m.CobrosModule)},
      { path: 'roles', loadChildren: () => import('./modulos/roles/roles.module').then(m => m.RolesModule)}
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
