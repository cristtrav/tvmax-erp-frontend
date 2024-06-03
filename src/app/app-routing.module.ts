import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './global/auth/auth.guard';
import { AppComponent } from './app.component';
import { SortearComponent } from './modules/sorteos/pages/sortear/sortear.component';
import { GanadoresComponent } from './modules/sorteos/pages/ganadores/ganadores.component';
import { canAccessFn } from 'src/app/global/auth/can-access-fn.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/app/dashboard' },
  {
    path: 'sortear/:idsorteo',
    data: { idfuncionalidad: 407, name: 'Realizar Sorteos'},
    canActivate: [canAccessFn],
    component: SortearComponent,
  },
  { path: 'sortear/:idsorteo/ganadores', component: GanadoresComponent },
  { path: 'login', loadChildren: () => import('./modules/login/login.module').then(m => m.LoginModule), canActivate: [AuthGuard] },
  {
    path: 'app', component: AppComponent, canActivate: [AuthGuard], children: [
      { path: 'dashboard', loadChildren: () => import('./modules/dashboard/dashboard.module').then(m=> m.DashboardModule) },
      { 
        path:'grupos',
        data: { idfuncionalidad: 5, name: 'Grupos'},
        canActivate: [canAccessFn],
        loadChildren: () => import('./modules/grupos/grupos.module').then(m => m.GruposModule)
      },
      {
        path: 'servicios',
        data: { idfuncionalidad: 24, name: 'Servicios'},
        canActivate: [canAccessFn],
        loadChildren: () => import('./modules/servicios/servicios.module').then(m => m.ServiciosModule)
      },
      {
        path: 'departamentos',
        data: { idfuncionalidad: 44, name: 'Departamentos'},
        canActivate: [canAccessFn],
        loadChildren: () => import('./modules/departamentos/departamentos.module').then(m => m.DepartamentosModule)
      },
      {
        path: 'distritos',
        data: { idfuncionalidad: 64, name: 'Distritos'},
        canActivate: [canAccessFn],
        loadChildren: () => import('./modules/distritos/distritos.module').then(m => m.DistritosModule)
      },
      {
        path: 'barrios',
        data: { idfuncionalidad: 84, name: 'Barrios'},
        canActivate: [canAccessFn],
        loadChildren: () => import('./modules/barrios/barrios.module').then(m => m.BarriosModule)
      },
      {
        path: 'clientes',
        data: { idfuncionalidad: 184, name: 'Clientes'},
        canActivate: [canAccessFn],
        loadChildren: () => import('./modules/clientes/clientes.module').then(m => m.ClientesModule)
      },
      {
        path: 'usuarios',
        data: { idfuncionalidad: 124, name: 'Usuarios'},
        canActivate: [canAccessFn],
        loadChildren: () => import('./modules/usuarios/usuarios.module').then(m => m.UsuariosModule)
      },
      {
        path: 'suscripciones',
        data: { idfuncionalidad: 165, name: 'Suscripciones'},
        canActivate: [canAccessFn],
        loadChildren: () => import('./modules/suscripciones/suscripciones.module').then(m => m.SuscripcionesModule)
      },
      {
        path: 'ventas',
        data: { idfuncionalidad: 266, name: 'Ventas'},
        canActivate: [canAccessFn],
        loadChildren: () => import ('./modules/ventas/ventas.module').then(m => m.VentasModule)
      },
      {
        path: 'timbrados',
        data: { idfuncionalidad: 244, name: 'Timbrados'},
        canActivate: [canAccessFn],
        loadChildren: () => import ('./modules/timbrados/timbrados.module').then(m => m.TimbradosModule)
      },
      {
        path: 'auditoria',
        data: { idfuncionalidad: 321, name: 'Auditoría'},
        canActivate: [canAccessFn],
        loadChildren: () => import('./modules/auditoria/auditoria.module').then(m => m.AuditoriaModule)
      },
      {
        path: 'roles',
        data: { idfuncionalidad: 144, name: 'Roles'},
        canActivate: [canAccessFn],
        loadChildren: () => import('./modules/roles/roles.module').then(m => m.RolesModule)
      },
      {
        path: 'formatosfacturas',
        data: { idfuncionalidad: 344, name: 'Formatos de Facturas'},
        canActivate: [canAccessFn],
        loadChildren: () => import('./modules/formatos-facturas/formatos-facturas.module').then(m => m.FormatosFacturasModule),
      },
      {
        path: 'pos',
        data: { idfuncionalidad: 380, name: 'Punto de Venta (POS)'},
        canActivate: [canAccessFn],
        loadChildren: () => import('./modules/pos/pos.module').then(m => m.PosModule)
      },
      {
        path: 'sorteos',
        data: { idfuncionalidad: 400, name: 'Sorteos'},
        canActivate: [canAccessFn],
        loadChildren: () => import('./modules/sorteos/sorteos.module').then(m => m.SorteosModule)
      },
      {
        path: 'domicilios',
        data: { idfuncionalidad: 200, name: 'Domicilios'},
        canActivate: [canAccessFn],
        loadChildren: () => import('./modules/domicilios/domicilios.module').then(m => m.DomiciliosModule)
      },
      {
        path: 'gruposmateriales',
        data: { idfuncionalidad: 600, name: 'Tipos de Materiales'},
        canActivate: [canAccessFn],
        loadChildren: () => import('./modules/depositos/modules/tipos-materiales/tipos-materiales.module').then(m => m.TiposMaterialesModule)
      },
      {
        path: 'materiales',
        data: { idfuncionalidad: 680, name: 'Materiales'},
        canActivate: [canAccessFn],
        loadChildren: () => import('./modules/depositos/modules/materiales/materiales.module').then(m => m.MaterialesModule)
      },
      {
        path: 'movimientosmateriales',
        data: { idfuncionalidad: 640, name: 'Movimientos de Materiales'},
        canActivate: [canAccessFn],
        loadChildren: () => import('./modules/depositos/modules/movimientos-materiales/movimientos-materiales.module').then(m => m.MovimientosMaterialesModule)
      },
      {
        path: 'usuariosdepositos',
        data: { idfuncionalidad: 720, name: 'Usuarios de Depósitos'},
        canActivate: [canAccessFn],
        loadChildren: () => import('./modules/depositos/modules/usuarios-depositos/usuarios-depositos.module').then(m => m.UsuariosDepositosModule)
      },
      {
        path: 'motivosreclamos',
        data: { idfuncionalidad: 760, name: 'Motivos de Reclamos'},
        canActivate: [canAccessFn],
        loadChildren: () => import('./modules/reclamos/modules/motivos/motivos.module').then(m => m.MotivosModule)
      },
      {
        path: 'reclamos',
        data: { idfuncionalidad: 800, name: 'Reclamos'},
        canActivate: [canAccessFn],
        loadChildren: () => import('./modules/reclamos/modules/reclamos/reclamos.module').then(m => m.ReclamosModule)
      },
      {
        path: 'asignacionesreclamos',
        loadChildren: () => import('./modules/reclamos/modules/asignaciones/asignaciones.module').then(m => m.AsignacionesModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
