import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Servicio } from './../../../dto/servicio-dto';
import { CuotasService } from './../../../servicios/cuotas.service';

@Component({
  selector: 'app-contenido-vista-cuotas',
  templateUrl: './contenido-vista-cuotas.component.html',
  styleUrls: ['./contenido-vista-cuotas.component.scss']
})
export class ContenidoVistaCuotasComponent implements OnInit {

  @Input()
  idsuscripcion: number | null = null;

  lstServicios: Servicio[] = [];

  constructor(
    private cuotaSrv: CuotasService,
    private notif: NzNotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarServicios();
  }

  private cargarServicios(): void{
    if(this.idsuscripcion){
      this.cuotaSrv.getServicios(this.idsuscripcion).subscribe((data)=>{
        this.lstServicios = data;
      }, (e)=>{
        console.log('Error al cargar lista de servicios');
        console.log(e);
        this.notif.create('error', 'Error al cargar lista de servicios', e.error);
      });
    }
  }
}
