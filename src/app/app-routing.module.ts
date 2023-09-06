import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './util/auth.guard';
import { AppComponent } from './app.component';
import { Extra } from '@util/extra';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/app/dashboard' },
  { path: 'login', loadChildren: () => import('./modulos/login/login.module').then(m => m.LoginModule), canActivate: [AuthGuard] },
  {
    path: 'app', component: AppComponent, canActivate: [AuthGuard], children: [
      {path: 'grupos', loadChildren: () => import('./modulos/grupos/grupos.module').then(m => m.GruposModule), canActivate: [Extra.getCanEnterModuleFn(5)]},
      { path: 'servicios', loadChildren: () => import('./modulos/servicios/servicios.module').then(m => m.ServiciosModule), canActivate: [Extra.getCanEnterModuleFn(24)] },
      { path: 'dashboard', loadChildren: () => import('./modulos/dashboard/dashboard.module').then(m=> m.DashboardModule) },
      { path: 'departamentos', loadChildren: () => import('./modulos/departamentos/departamentos.module').then(m => m.DepartamentosModule), canActivate: [Extra.getCanEnterModuleFn(44)] },
      { path: 'distritos', loadChildren: () => import('./modulos/distritos/distritos.module').then(m => m.DistritosModule), canActivate: [Extra.getCanEnterModuleFn(64)] },
      { path: 'barrios', loadChildren: () => import('./modulos/barrios/barrios.module').then(m => m.BarriosModule), canActivate: [Extra.getCanEnterModuleFn(84)] },
      { path: 'clientes', loadChildren: () => import('./modulos/clientes/clientes.module').then(m => m.ClientesModule), canActivate: [Extra.getCanEnterModuleFn(184)] },
      { path: 'usuarios', loadChildren: () => import('./modulos/usuarios/usuarios.module').then(m => m.UsuariosModule), canActivate: [Extra.getCanEnterModuleFn(124)] },
      { path: 'suscripciones', loadChildren: () => import('./modulos/suscripciones/suscripciones.module').then(m => m.SuscripcionesModule), canActivate: [Extra.getCanEnterModuleFn(165)] },
      { path: 'ventas', loadChildren: () => import ('./modulos/ventas/ventas.module').then(m => m.VentasModule), canActivate: [Extra.getCanEnterModuleFn(266)]},
      { path: 'timbrados', loadChildren: () => import ('./modulos/timbrados/timbrados.module').then(m => m.TimbradosModule), canActivate: [Extra.getCanEnterModuleFn(244)] },
      { path: 'auditoria', loadChildren: () => import('./modulos/auditoria/auditoria.module').then(m => m.AuditoriaModule), canActivate: [Extra.getCanEnterModuleFn(321)] },
      //{ path: 'cobros', loadChildren: () => import('./modulos/cobros/cobros.module').then(m => m.CobrosModule), canActivate: [Extra.getCanEnterModuleFn(361)]},
      { path: 'roles', loadChildren: () => import('./modulos/roles/roles.module').then(m => m.RolesModule), canActivate: [Extra.getCanEnterModuleFn(144)]},
      { path: 'formatosfacturas', loadChildren: () => import('./modulos/formatos-facturas/formatos-facturas.module').then(m => m.FormatosFacturasModule), canActivate: [Extra.getCanEnterModuleFn(344)]},
      { path: 'pos', loadChildren: () => import('./modulos/pos/pos.module').then(m => m.PosModule)},
      { path: 'domicilios', loadChildren: () => import('./modulos/domicilios/domicilios.module').then(m => m.DomiciliosModule)}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
