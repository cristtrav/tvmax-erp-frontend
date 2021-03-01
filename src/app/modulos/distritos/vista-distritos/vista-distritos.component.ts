import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Distrito } from './../../../dto/distrito-dto';
import { DistritosService } from './../../../servicios/distritos.service';

@Component({
  selector: 'app-vista-distritos',
  templateUrl: './vista-distritos.component.html',
  styleUrls: ['./vista-distritos.component.scss']
})
export class VistaDistritosComponent implements OnInit {

  lstDist: Distrito[] = [];

  constructor(
    private distSrv: DistritosService,
    private notif: NzNotificationService
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    this.distSrv.get().subscribe((data)=>{
      this.lstDist = data;
    }, (e)=>{
      console.log('Error al cargar distritos');
      console.log(e);
      this.notif.create('error', 'Error al cargar distritos', e.error);
    });
  }

  eliminar(id: string | null) {
    if (id !== null) {
      this.distSrv.delete(id).subscribe(()=>{
        this.notif.create('success', 'Eliminado correctamente', '');
        this.cargarDatos();
      }, (e)=>{
        console.log('Error al eliminar distrito');
        console.log(e);
        this.notif.create('error', 'Error al eliminar', e.error);
      });
    }
  }

}
