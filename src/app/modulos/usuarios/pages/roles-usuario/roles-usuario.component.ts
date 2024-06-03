import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RolDTO } from '@dto/rol.dto';
import { UsuarioDTO } from '@dto/usuario.dto';
import { RolesService } from '@global-services/roles.service';
import { UsuariosService } from '@global-services/usuarios.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { finalize, forkJoin } from 'rxjs';

@Component({
  selector: 'app-roles-usuario',
  templateUrl: './roles-usuario.component.html',
  styleUrls: ['./roles-usuario.component.scss']
})
export class RolesUsuarioComponent implements OnInit {

  idusuario: string = '';
  usuario!: UsuarioDTO;

  lstRoles: RolDTO[] = [];
  rolesSeleccionados = new Set<number>();
  loadingDatos: boolean = false;
  guardando: boolean = false;

  constructor(
    private aroute: ActivatedRoute,
    private router: Router,
    private usuarioSrv: UsuariosService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private rolesSrv: RolesService,
    private notif: NzNotificationService
  ){}

  ngOnInit(): void {
    const idusuarioStr = this.aroute.snapshot.paramMap.get('idusuario');
    if(Number.isInteger(Number(idusuarioStr))) this.idusuario = `${idusuarioStr}`;
    else this.router.navigate(['/app', 'usuarios']);
    this.cargarDatos(Number(this.idusuario));
  }

  private cargarDatos(idusuario: number){
    this.loadingDatos = true;
    const paramsRoles = new HttpParams().append('eliminado', false);
    forkJoin({
      usuario: this.usuarioSrv.getPorId(idusuario),
      roles: this.rolesSrv.get(paramsRoles)
    })
    .pipe(finalize(() => this.loadingDatos = false))
    .subscribe({
      next: (resp) => {
        this.usuario = resp.usuario;
        this.rolesSeleccionados.clear();
        resp.usuario.idroles?.forEach(idrol => this.rolesSeleccionados.add(idrol));
        this.lstRoles = resp.roles;
      },
      error: (e) => {
        console.error('Error al cargar datos', e);
        this.httpErrorHandler.process(e);
      }
    });
  }
  
  onCheckedChange(idrol: number, checked: boolean){
    if(checked) this.rolesSeleccionados.add(idrol);
    else this.rolesSeleccionados.delete(idrol);
  }

  guardar(){
    this.usuario.idroles = Array.from(this.rolesSeleccionados);
    this.guardando = true;
    this.usuarioSrv
    .editRolesByUsuario(this.usuario.id, this.usuario.idroles)
    /*this.usuarioSrv
      .put(this.usuario.id, this.usuario)*/
      .pipe(finalize(() => this.guardando = false))
      .subscribe({
      next: () => {
        this.notif.success('<strong>Éxito</strong>', 'Roles guardados.');
      },
      error: (e) => {
        console.error('Error al guardar roles', e);
        this.httpErrorHandler.process(e);
      }
    })
    
  }

}
