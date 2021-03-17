import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VistaUsuariosComponent } from './vista-usuarios/vista-usuarios.component';
import { DetalleUsuarioComponent } from './detalle-usuario/detalle-usuario.component';

const routes: Routes = [
  { path: '', component: VistaUsuariosComponent },
  { path: ':idusuario', component: DetalleUsuarioComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
