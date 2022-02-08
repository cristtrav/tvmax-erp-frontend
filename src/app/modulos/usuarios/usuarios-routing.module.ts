import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaUsuariosComponent } from './vista-usuarios/vista-usuarios.component';
import { DetalleUsuarioComponent } from './detalle-usuario/detalle-usuario.component';
import { PermisosUsuarioComponent } from './permisos-usuario/permisos-usuario.component';

const routes: Routes = [
  { path: '', component: VistaUsuariosComponent },
  { path: ':idusuario', component: DetalleUsuarioComponent},
  { path: ':idusuario/permisos', component: PermisosUsuarioComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
