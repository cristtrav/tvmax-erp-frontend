import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Modulo } from '@dto/modulo-dto';
import { PermisosService } from '@servicios/permisos.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { NzTreeComponent, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UsuariosService } from '@servicios/usuarios.service';
import { Usuario } from '@dto/usuario.dto';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-permisos-usuario',
  templateUrl: './permisos-usuario.component.html',
  styleUrls: ['./permisos-usuario.component.scss']
})
export class PermisosUsuarioComponent implements OnInit {

  @ViewChild('nzTreeComponent', { static: false }) nzTreeComponent!: NzTreeComponent;

  idusuario: string | null = null;
  lstModulos: Modulo[] = [];
  nodosVistaPermisos: NzTreeNodeOptions[] = [];
  defaultCheckedKeys: string[] = [];
  defaultSelectedKeys: string[] = [];
  defaultExpandedKeys: string[] = [];

  guardandoPermisos: boolean = false;
  cargandoPermisos: boolean = false;

  usuario: Usuario | null = null;

  constructor(
    private aroute: ActivatedRoute,
    private permisosSrv: PermisosService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private notif: NzNotificationService,
    private usuarioSrv: UsuariosService
  ) { }

  ngOnInit(): void {
    this.idusuario = this.aroute.snapshot.paramMap.get('idusuario');
    this.cargarModulos();
    this.cargarUsuario();
  }

  cargarUsuario(): void {
    if (this.idusuario) this.usuarioSrv.getPorId(Number(this.idusuario)).subscribe({
      next: (usuario) => {
        this.usuario = usuario;
      },
      error: (e) => {
        console.error('Error al cargar usuario por id', e)
        this.httpErrorHandler.process(e);
      }
    });
  }

  cargarModulos(): void {
    this.cargandoPermisos = true;
    let paramsModulos: HttpParams = new HttpParams();
    paramsModulos = paramsModulos.append('eliminado', 'false');
    paramsModulos = paramsModulos.append('sort', '+descripcion');

    let paramsPermisos: HttpParams = new HttpParams();
    paramsPermisos = paramsPermisos.append('sort', '+nombre');

    forkJoin({
      modulos: this.permisosSrv.getModulosFuncionalidades(paramsModulos),
      permisos: this.permisosSrv.getPermisosUsuario(Number(this.idusuario), paramsPermisos)
    }).subscribe({
      next: (resp) => {
        const nodos: NzTreeNodeOptions[] = [];
        this.lstModulos = resp.modulos;
        this.cargandoPermisos = false;

        this.lstModulos.forEach(modulo => {
          const nodosFuncionalidades: NzTreeNodeOptions[] = [];
          modulo.funcionalidades.forEach(funcionalidad => {
            nodosFuncionalidades.push({
              title: funcionalidad.nombre ?? '(Sin descripción)',
              descripcion: funcionalidad.descripcion,
              key: `fun-${funcionalidad.id}`,
              isLeaf: true,
            });
          });

          nodos.push({
            title: modulo.descripcion ?? '(Sin descripción)',
            key: `mod-${modulo.id}`,
            children: nodosFuncionalidades
          });

          const selectedKeys: string[] = [];
          resp.permisos.forEach(permiso => {
            selectedKeys.push(`fun-${permiso.id}`);
          })

          this.defaultCheckedKeys = selectedKeys;
          this.nodosVistaPermisos = nodos;
        });
      },
      error: (e) => {
        console.error('Error al caragar modulos y funcionalidades', e);
        this.httpErrorHandler.process(e);
        this.cargandoPermisos = false;
      }
    });
  }

  guardar(): void {
    const idfuncionalidades: number[] = [];

    this.nzTreeComponent.getCheckedNodeList()
      .filter(node => node.level === 0)
      .forEach(nodeLevel0 => {
        idfuncionalidades.push(
          ...nodeLevel0.children.map(nodeLevel1 => Number(nodeLevel1.key.split('-')[1]))
        );
      });

    idfuncionalidades.push(
      ...this.nzTreeComponent.getCheckedNodeList()
        .filter(node => node.level === 1)
        .map(nodeLevel1 => Number(nodeLevel1.key.split('-')[1]))
    );

    if (this.idusuario) {
      this.guardandoPermisos = true;
      this.permisosSrv.putPermisosUsuario(Number(this.idusuario), idfuncionalidades).subscribe({
        next: () => {
          this.notif.create('success', '<b>Éxito</b>', 'Permisos editados');
          this.guardandoPermisos = false;
        },
        error: (e) => {
          console.error('Error al guardar permisos de usuario', e);
          this.httpErrorHandler.process(e);
          this.guardandoPermisos = false;
        }
      });
    }
  }

}
