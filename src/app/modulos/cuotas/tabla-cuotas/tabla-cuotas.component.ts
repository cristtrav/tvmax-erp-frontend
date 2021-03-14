import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Cuota } from './../../../dto/cuota-dto';
import { CuotasService} from './../../../servicios/cuotas.service';

@Component({
  selector: 'app-tabla-cuotas',
  templateUrl: './tabla-cuotas.component.html',
  styleUrls: ['./tabla-cuotas.component.scss']
})
export class TablaCuotasComponent implements OnInit {

  @Input()
  idservicio: number | null = null;
  @Input()
  idsuscripcion: number | null = null;

  lstCuotas: Cuota[] = [];

  constructor(
    private cuotaSrv: CuotasService,
    private notif: NzNotificationService
  ) { }

  ngOnInit(): void {
    this.cargarCuotas();
  }

  private cargarCuotas(): void{
    let filters: Array<{key: string, value: any | null}> = [{key: 'sort', value: '-fecha_vencimiento'}];
    if(this.idservicio){
      filters.push({key: 'idservicio', value: this.idservicio});
    }
    if(this.idsuscripcion){
      filters.push({key: 'idsuscripcion', value: this.idsuscripcion});
    }
    this.cuotaSrv.get(filters).subscribe((data)=>{
      this.lstCuotas = data;
    }, (e)=>{
      console.log('Error al cargar cuotas');
      console.log(e);
      this.notif.create('error', 'Error al cargar cuotas', e.error);
    });
  }

  eliminar(id: number | null): void{
    if(id){
      this.cuotaSrv.delete(id).subscribe(()=>{
        this.notif.create('success', 'Cuota eliminada correctamente', '');
        this.cargarCuotas();
      }, (e)=>{
        console.log('Error al eliminar cuota');
        console.log(e);
        this.notif.create('error', 'Error al eliminar cuota', e.error);
      });
    }
  }

}
