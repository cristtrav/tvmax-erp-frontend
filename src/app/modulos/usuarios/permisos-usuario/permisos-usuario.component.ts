import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router' ;
import { Funcionalidad } from '@dto/funcionalidad-dto';
import { Modulo } from '@dto/modulo-dto';
import { ServerResponseList } from '@dto/server-response-list.dto';
import { PermisosService } from '@servicios/permisos.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { NzTreeComponent, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { UsuariosService } from '@servicios/usuarios.service';
import { Usuario } from '@dto/usuario.dto';

@Component({
  selector: 'app-permisos-usuario',
  templateUrl: './permisos-usuario.component.html',
  styleUrls: ['./permisos-usuario.component.scss']
})
export class PermisosUsuarioComponent implements OnInit {

  @ViewChild('nzTreeComponent', {static: false}) nzTreeComponent!: NzTreeComponent;

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

  cargarUsuario(): void{
    if(this.idusuario){
      this.usuarioSrv.getPorId(Number(this.idusuario)).subscribe((data: Usuario)=>{
        this.usuario = data;
      }, (e)=>{
        console.log('Error al cargar usuario');
        console.log(e);
        this.httpErrorHandler.handle(e, 'consultar datos de usuario');
      });
    }    
  }

  cargarModulos(): void{
    this.cargandoPermisos = true;
    let params: HttpParams = new HttpParams();
    params = params.append('eliminado', 'false');
    params = params.append('sort', '+descripcion');
    this.permisosSrv.getModulosFuncionalidades(params).subscribe((resp: ServerResponseList<Modulo>)=>{
      this.lstModulos = resp.data;
      const nodos: NzTreeNodeOptions[] = [];
      for(let mod of this.lstModulos){
        const nodosFunc: NzTreeNodeOptions[] = [];        
        for(let func of mod.funcionalidades){
          nodosFunc.push({
            title: func.nombre ?? '(Sin descripción)',
            descripcion: func.descripcion,
            key: `fun-${func.id}`,
            isLeaf: true
          });
        }
        nodos.push(
          {
            title: mod.descripcion ?? '(Sin descripción)',
            key: `mod-${mod.id}`,
            children: nodosFunc,
          }
        );
      }
      this.nodosVistaPermisos = nodos;
      this.cargarPermisosUsuario();
    }, (e)=>{
      this.cargandoPermisos = false;
      console.log('Error al consultar modulos y funcionalidades');
      console.log(e);
      this.httpErrorHandler.handle(e);
    });
  }

  cargarPermisosUsuario(): void{
    let params: HttpParams = new HttpParams();
    params = params.append('sort', '+nombre');
    if(this.idusuario){
      this.permisosSrv.getPermisosUsuario(Number(this.idusuario), params).subscribe((resp: ServerResponseList<Funcionalidad>)=>{
        const funcChecked: string[] = [];
        for(let func of resp.data){
          funcChecked.push(`fun-${func.id}`);
        }
        this.defaultCheckedKeys = funcChecked;
        this.cargandoPermisos = false;
      }, (e)=>{
        console.log('Error al cargar permisos del usuario');
        console.log(e);
        this.httpErrorHandler.handle(e);
        this.cargandoPermisos = false;
      });
    }
  }
  
  guardar(): void{
    console.log(this.nzTreeComponent);
    console.log(this.nzTreeComponent.getCheckedNodeList());
    const idfunc: number[] = [];
    for(let node of this.nzTreeComponent.getCheckedNodeList()){
      if(node.level === 0){
        for(let node2 of node.children){
          idfunc.push(Number(node2.key.split('-')[1]));
        }
      }else{
        idfunc.push(Number(node.key.split('-')[1]));
      }
    }
    if(this.idusuario){
      this.guardandoPermisos = true;
      this.permisosSrv.putPermisosUsuario(Number(this.idusuario), idfunc).subscribe(()=>{
        this.guardandoPermisos = false;
        this.notif.create('success', '<b>Éxito</b>', 'Permisos guardados correctamente');
      }, (e)=>{
        this.guardandoPermisos = false;
        console.log('Error al guardar permisos');
        console.log(e);
        this.httpErrorHandler.handle(e, 'guardar permisos');
      });
    }
    
    console.log(idfunc);
  }

}
