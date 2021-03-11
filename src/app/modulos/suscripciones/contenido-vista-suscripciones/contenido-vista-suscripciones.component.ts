import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Suscripcion } from './../../../dto/suscripcion-dto';
import { SuscripcionesService } from './../../../servicios/suscripciones.service';

@Component({
  selector: 'app-contenido-vista-suscripciones',
  templateUrl: './contenido-vista-suscripciones.component.html',
  styleUrls: ['./contenido-vista-suscripciones.component.scss']
})
export class ContenidoVistaSuscripcionesComponent implements OnInit {

  @Input()
  idcliente: number | null = null;

  lstSuscripciones: Suscripcion[] = [];

  constructor(
    private suscripSrv: SuscripcionesService,
    private notif: NzNotificationService
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos(): void{
    let filt = [];
    if(this.idcliente){
      filt.push({key: 'idcliente', value: this.idcliente});
    }
    this.suscripSrv.get(filt).subscribe((data)=>{
      this.lstSuscripciones = data;
    }, (e)=>{
      console.log('Error al cargar suscripciones');
      console.log(e);
      this.notif.create('error', 'Error al cargar suscripciones', e.error);
    });
  }

  eliminar(id: number | null): void {
    if(id){
      this.suscripSrv.delete(id).subscribe(()=>{
        this.notif.create('success', 'Suscripción eliminada correctamente', '');
        this.cargarDatos();
      }, (e)=>{
        console.log('Error al eliminar suscripcion');
        console.log(e);
        this.notif.create('error', 'Error al eliminar suscripción', e.error);
      });
    }
  }

}
