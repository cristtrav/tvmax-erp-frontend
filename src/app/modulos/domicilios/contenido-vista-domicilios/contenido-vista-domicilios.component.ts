import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Domicilio } from './../../../dto/domicilio-dto';
import { DomiciliosService } from './../../../servicios/domicilios.service';

@Component({
  selector: 'app-contenido-vista-domicilios',
  templateUrl: './contenido-vista-domicilios.component.html',
  styleUrls: ['./contenido-vista-domicilios.component.scss']
})
export class ContenidoVistaDomiciliosComponent implements OnInit {

  lstDomicilios: Domicilio[] = [];

  @Input()
  idcliente: number | null = null;

  constructor(
    private domiSrv: DomiciliosService,
    private notif: NzNotificationService
  ) { }

  ngOnInit(): void {
    console.log(`idcliente en contenido vista domicilios> ${this.idcliente}`);
    this.cargarDatos();
  }

  private cargarDatos(): void{
    this.domiSrv.get([{key: 'idcliente', value: this.idcliente}]).subscribe((data)=>{
      this.lstDomicilios = data;
    }, (e)=>{
      console.log(e);
    });
  }

  eliminar(id: number | null): void {
    if(id!==null){
      this.domiSrv.eliminar(id).subscribe(()=>{
        this.notif.create('success', 'Eliminado correctamente', '');
        this.cargarDatos();
      }, (e)=>{
        console.log('Error al eliminar domicilio');
        console.log(e)
        this.notif.create('error', 'Error al eliminar', e.error);
      });
    }
  }

}
