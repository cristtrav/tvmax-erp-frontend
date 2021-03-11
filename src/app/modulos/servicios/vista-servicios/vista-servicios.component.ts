import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { ServiciosService } from 'src/app/servicios/servicios.service';
import { Servicio } from './../../../dto/servicio-dto';

@Component({
  selector: 'app-vista-servicios',
  templateUrl: './vista-servicios.component.html',
  styleUrls: ['./vista-servicios.component.scss']
})
export class VistaServiciosComponent implements OnInit {

  lstServicios: Servicio[] = [];

  constructor(
    private serviciosSrv: ServiciosService,
    private notif: NzNotificationService
  ) { }

  ngOnInit(): void {
    this.cargarServicios();
  }

  private cargarServicios(): void{
    const params = [{key: 'sort', value: '+id'}];
    this.serviciosSrv.getServicios(params).subscribe((data)=>{
      this.lstServicios = data;
    }, (e)=>{
      console.log('Error al cargar Servicios');
      console.log(e);
      this.notif.create('error', 'Error al cargar servicios', e.error);
    });
  }

  eliminar(id: number | null): void{
    if(id!==null){
      this.serviciosSrv.deleteServicio(id).subscribe(()=>{
        this.cargarServicios();
        this.notif.create('success', 'Eliminado correctamente', '');
      }, (e)=>{
        console.log('Error al eliminar Servicio');
        console.log(e);
        this.notif.create('error', 'Error al eliminar', e.error);
      });
    }
  }

}
