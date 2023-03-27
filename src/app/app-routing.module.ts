import { inject, NgModule } from '@angular/core';
import { Routes, RouterModule, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthGuard } from './util/auth.guard';
import { AppComponent } from './app.component';
import { SesionService } from '@servicios/sesion.service';

const getCanEnterModuleFn = (idfuncionalidad: number) => {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree => {
    if(inject(SesionService).permisos.has(idfuncionalidad)) return true;
    else return inject(Router).createUrlTree(['app', 'dashboard']);
  }
}

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/app/dashboard' },
  { path: 'login', loadChildren: () => import('./modulos/login/login.module').then(m => m.LoginModule), canActivate: [AuthGuard] },
  {
    path: 'app', component: AppComponent, canActivate: [AuthGuard], children: [
      {path: 'grupos', loadChildren: () => import('./modulos/grupos/grupos.module').then(m => m.GruposModule), canActivate: [getCanEnterModuleFn(5)]},
      { path: 'servicios', loadChildren: () => import('./modulos/servicios/servicios.module').then(m => m.ServiciosModule), canActivate: [getCanEnterModuleFn(24)] },
      { path: 'dashboard', loadChildren: () => import('./modulos/dashboard/dashboard.module').then(m=> m.DashboardModule) },
      { path: 'departamentos', loadChildren: () => import('./modulos/departamentos/departamentos.module').then(m => m.DepartamentosModule), canActivate: [getCanEnterModuleFn(44)] },
      { path: 'distritos', loadChildren: () => import('./modulos/distritos/distritos.module').then(m => m.DistritosModule), canActivate: [getCanEnterModuleFn(64)] },
      { path: 'barrios', loadChildren: () => import('./modulos/barrios/barrios.module').then(m => m.BarriosModule), canActivate: [getCanEnterModuleFn(84)] },
      { path: 'clientes', loadChildren: () => import('./modulos/clientes/clientes.module').then(m => m.ClientesModule), canActivate: [getCanEnterModuleFn(184)] },
      { path: 'usuarios', loadChildren: () => import('./modulos/usuarios/usuarios.module').then(m => m.UsuariosModule), canActivate: [getCanEnterModuleFn(124)] },
      { path: 'suscripciones', loadChildren: () => import('./modulos/suscripciones/suscripciones.module').then(m => m.SuscripcionesModule), canActivate: [getCanEnterModuleFn(165)] },
      { path: 'ventas', loadChildren: () => import ('./modulos/ventas/ventas.module').then(m => m.VentasModule), canActivate: [getCanEnterModuleFn(266)]},
      { path: 'timbrados', loadChildren: () => import ('./modulos/timbrados/timbrados.module').then(m => m.TimbradosModule), canActivate: [getCanEnterModuleFn(244)] },
      { path: 'auditoria', loadChildren: () => import('./modulos/auditoria/auditoria.module').then(m => m.AuditoriaModule), canActivate: [getCanEnterModuleFn(321)] },
      { path: 'cobros', loadChildren: () => import('./modulos/cobros/cobros.module').then(m => m.CobrosModule), canActivate: [getCanEnterModuleFn(361)]},
      { path: 'roles', loadChildren: () => import('./modulos/roles/roles.module').then(m => m.RolesModule), canActivate: [getCanEnterModuleFn(144)]},
      { path: 'formatosfacturas', loadChildren: () => import('./modulos/formatos-facturas/formatos-facturas.module').then(m => m.FormatosFacturasModule), canActivate: [getCanEnterModuleFn(344)]}
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
