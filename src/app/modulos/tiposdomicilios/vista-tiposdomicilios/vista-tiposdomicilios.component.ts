import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { TipoDomicilio } from './../../../dto/tipodomicilio-dto';
import { TiposdomiciliosService } from './../../../servicios/tiposdomicilios.service';

@Component({
  selector: 'app-vista-tiposdomicilios',
  templateUrl: './vista-tiposdomicilios.component.html',
  styleUrls: ['./vista-tiposdomicilios.component.scss']
})
export class VistaTiposdomiciliosComponent implements OnInit {

  lstTD: TipoDomicilio[] = [];

  constructor(
    private tdSrv: TiposdomiciliosService,
    private notif: NzNotificationService
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    this.tdSrv.get().subscribe((data)=>{
      this.lstTD = data;
    }, (e)=>{
      console.log('Error al cargar tipos de domicilios');
      console.log(e);
      this.notif.create('error', 'Error al cargar tipos de domicilios', e.error);
    });
  }

  eliminar(id: number | null): void {
    if(id!==null){
      this.tdSrv.delete(id).subscribe(()=>{
        this.notif.create('success', 'Eliminado correctamente', '');
        this.cargarDatos();
      }, (e)=>{
        console.log('Error al elliminar tipo de domicilio');
        console.log(e);
        this.notif.create('error', 'Error al eliminar', e.error);
      });
    }
  }

}
