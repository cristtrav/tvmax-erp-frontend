import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Usuario } from './../../../dto/usuario-dto';
import { UsuariosService } from './../../../servicios/usuarios.service';

@Component({
  selector: 'app-vista-usuarios',
  templateUrl: './vista-usuarios.component.html',
  styleUrls: ['./vista-usuarios.component.scss']
})
export class VistaUsuariosComponent implements OnInit {

  lstUsuarios: Usuario[] = [];

  constructor(
    private usuariosSrv: UsuariosService,
    private notif: NzNotificationService
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos(): void{
    let f: Array<{key: string, value: any | null}> = [{key: 'sort', value: '+id'}];
    this.usuariosSrv.get(f).subscribe((data)=>{
      this.lstUsuarios = data;
    }, (e)=>{
      console.log('Error al consultar usuarios');
      console.log(e);
      this.notif.create('error', 'Error al cargar usuarios', e.error);
    });
  }

  eliminar(id: number | null): void{
    if(id){
      this.usuariosSrv.delete(id).subscribe(()=>{
        this.notif.create('success', 'Usuario eliminado correctamente', '');
        this.cargarDatos();
      }, (e)=>{
        console.log('Error al eliminar usuario');
        console.log(e);
        this.notif.create('error', 'Error al eliminar usuario', e.error);
      });
    }
  }

}
