import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Modulo } from '@dto/modulo-dto';
import { PermisosService } from '@servicios/permisos.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { NzFormatEmitEvent, NzTreeComponent, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UsuariosService } from '@servicios/usuarios.service';
import { Usuario } from '@dto/usuario.dto';
import { forkJoin } from 'rxjs';
import { Funcionalidad } from '@dto/funcionalidad-dto';

@Component({
  selector: 'app-permisos-usuario',
  templateUrl: './permisos-usuario.component.html',
  styleUrls: ['./permisos-usuario.component.scss']
})
export class PermisosUsuarioComponent implements OnInit {

  @ViewChild('nzTreeComponent', { static: false }) nzTreeComponent!: NzTreeComponent;

  idusuario: string | null = null;
  lstModulos: Modulo[] = [];
  lstFuncionalidades: Funcionalidad[] = [];
  nodosVistaPermisos: NzTreeNodeOptions[] = [];
  defaultCheckedKeys: string[] = [];
  defaultSelectedKeys: string[] = [];
  defaultExpandedKeys: string[] = [];

  mapRequeridoPor = new Map<number, number[]>();
  mapNombresRequeridos = new Map<number, string>();

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
        const selectedKeys: string[] = [];
        this.lstFuncionalidades = [];
        this.lstModulos = resp.modulos;
        this.mapRequeridoPor.clear();

        resp.permisos.forEach(permiso => {
          selectedKeys.push(`fun-${permiso.id}`);
          this.agregarRequeridoPor(permiso);
        });

        this.lstModulos.forEach(modulo => {
          this.lstFuncionalidades = this.lstFuncionalidades.concat(modulo.funcionalidades);
          const nodosFuncionalidades: NzTreeNodeOptions[] = [];

          modulo.funcionalidades.forEach(funcionalidad => {

            nodosFuncionalidades.push({
              title: funcionalidad.nombre ?? '(Sin descripción)',
              descripcion: funcionalidad.descripcion,
              key: `fun-${funcionalidad.id}`,
              isLeaf: true,
              disableCheckbox: this.isFuncionalidadRequerida(funcionalidad),
              checked: this.isFuncionalidadRequerida(funcionalidad),
              id: funcionalidad.id
            });
          });

          nodos.push({
            title: modulo.descripcion ?? '(Sin descripción)',
            key: `mod-${modulo.id}`,
            children: nodosFuncionalidades,
            id: modulo.id
          });

          this.defaultCheckedKeys = selectedKeys;
          this.nodosVistaPermisos = nodos;
        });
        this.actualizarDescripcionesRequeridos();
        this.cargandoPermisos = false;
      },
      error: (e) => {
        console.error('Error al caragar modulos y funcionalidades', e);
        this.httpErrorHandler.process(e);
        this.cargandoPermisos = false;
      }
    });
  }

  actualizarDescripcionesRequeridos(){
    this.mapNombresRequeridos.clear();
    this.mapRequeridoPor.forEach((value, key, map) =>{
      const arrayNombresFunc: string[] = [];
      value.forEach(idfunc => {
        const nombre = this.getDescripcionFuncionalidad(idfunc);
        if(nombre.length > 0) arrayNombresFunc.push(nombre);
      });
      this.mapNombresRequeridos.set(key, arrayNombresFunc.join(', '));
    })
  }

  getDescripcionFuncionalidad(idfuncionalidad: number): string{
    const funcionalidad = this.lstFuncionalidades.find(fun => fun.id == idfuncionalidad);
    if(funcionalidad == null) return '';
    const modulo = this.lstModulos.find(mod => mod.id == funcionalidad.idmodulo);
    return `${funcionalidad.nombre} (${modulo != null ? modulo.descripcion : 'Módulo Indefinido'})`;
  }

  onNzCheckBoxChange(event: NzFormatEmitEvent) {
    if (event.node?.level == 1) {
      const permiso = this.lstFuncionalidades.find(func => func.id == Number(event.node?.key.split('-')[1]));
      if (permiso) this.actualizarRequerimientos(permiso, event.node.isChecked);
    } else if (event.node?.level == 0) {
      event.node.children.forEach(nodolvl1 => {
        const permiso = this.lstFuncionalidades.find(func => func.id == Number(nodolvl1.key.split('-')[1]));
        if (permiso) this.actualizarRequerimientos(permiso, nodolvl1.isChecked);
      });
    }
    this.actualizarDescripcionesRequeridos();
  }

  actualizarRequerimientos(permiso: Funcionalidad, agregar: boolean) {
    if (agregar) this.agregarRequeridoPor(permiso);
    else this.quitarRequeridoPor(permiso);

    this.nzTreeComponent.getTreeNodes().forEach(nodoLvl0 => {
      nodoLvl0.children.forEach(nodoLvl1 => nodoLvl1.isDisableCheckbox = false)
    })

    this.mapRequeridoPor.forEach((value, key, map) => {
      const node = this.nzTreeComponent.getTreeNodeByKey(`fun-${key}`);
      if (node == null) return;
      node.isDisableCheckbox = true;
      node.setSyncChecked(true);
    });
  }

  isFuncionalidadRequerida(funcionalidad: Funcionalidad): boolean {
    const arrayRequeridoPor = this.mapRequeridoPor.get(funcionalidad.id ?? -1);
    return arrayRequeridoPor != null && arrayRequeridoPor.length > 0;
  }

  agregarRequeridoPor(permiso: Funcionalidad) {
    permiso.dependencias?.forEach(dependencia => {
      const arrayRequeridoPor = this.mapRequeridoPor.get(dependencia.id ?? -1) ?? [];
      if (!arrayRequeridoPor.includes(permiso.id ?? -1)) arrayRequeridoPor.push(permiso.id ?? -1);
      this.mapRequeridoPor.set(dependencia.id ?? -1, arrayRequeridoPor);
    });
  }

  quitarRequeridoPor(permiso: Funcionalidad) {
    permiso.dependencias?.forEach(dependencia => {
      const arrayRequeridoPor = this.mapRequeridoPor.get(dependencia.id ?? -1) ?? [];
      const index = arrayRequeridoPor.indexOf(permiso.id ?? -1)
      if (index > -1) arrayRequeridoPor.splice(index, 1);
      if (arrayRequeridoPor.length > 0) this.mapRequeridoPor.set(dependencia.id ?? -1, arrayRequeridoPor);
      else this.mapRequeridoPor.delete(dependencia.id ?? -1);
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
