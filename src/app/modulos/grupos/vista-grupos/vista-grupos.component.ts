import { Component, OnInit } from '@angular/core';
import { Grupo } from '../../../dto/grupo-dto';
import { GruposService } from '../../../servicios/grupos.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-vista-grupos',
  templateUrl: './vista-grupos.component.html',
  styleUrls: ['./vista-grupos.component.scss']
})
export class VistaGruposComponent implements OnInit {

  lstGrupos: Grupo[] = [];

  constructor(
    private grupoSrv: GruposService,
    private notif: NzNotificationService
    ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos(){
    this.grupoSrv.getGrupos().subscribe((data)=>{
      this.lstGrupos = data;
    }, (error)=>{
      console.log(`Error al cargar grupos`);
      console.log(error);
    });
  }

  eliminar(id: any): void{
    console.log('eliminar');
    this.grupoSrv.deleteGrupo(<number>id).subscribe(()=>{
      console.log('Exito');
      this.cargarDatos();
      this.notif.create('success', 'Eliminado correctamente', '');
    }, (e)=>{
      console.error(e);
      this.notif.create('error', 'Error al eliminar', e.error);
    });
  }

}
