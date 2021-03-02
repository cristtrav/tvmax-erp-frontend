import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Barrio } from './../../../dto/barrio-dto';
import { BarriosService } from './../../../servicios/barrios.service';

@Component({
  selector: 'app-vista-barrios',
  templateUrl: './vista-barrios.component.html',
  styleUrls: ['./vista-barrios.component.scss']
})
export class VistaBarriosComponent implements OnInit {

  lstBarrios: Barrio[] = [];

  constructor(
    private barrioSrv: BarriosService,
    private notif: NzNotificationService
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.barrioSrv.get().subscribe((data)=>{
      this.lstBarrios = data;
    }, (e)=>{
      console.log('Error al cargar barrios');
      console.log(e);
      this.notif.create('error', 'Error al cargar barrios', e.error);
    });
  }

  eliminar(id: number | null): void{
    if(id !== null) {
      this.barrioSrv.delete(id).subscribe(()=>{
        this.notif.create('success', 'Eliminado correctamente', '');
        this.cargarDatos();
      }, (e)=>{
        console.log('Error al eliminar barrios');
        console.log(e);
        this.notif.create('error', 'Error al eliminar', e.error);
      });
    }
  }

}
