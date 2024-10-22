import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { EstablecimientoDTO } from '@dto/facturacion/establecimiento.dto';
import { EstablecimientosService } from '@services/facturacion/establecimientos.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-vista-establecimientos',
  templateUrl: './vista-establecimientos.component.html',
  styleUrls: ['./vista-establecimientos.component.scss']
})
export class VistaEstablecimientosComponent implements OnInit {

  cargandoDatos: boolean = false;
  lstEstablecimientos: EstablecimientoDTO[] = [];

  expandSet = new Set<number>();
  
  constructor(
    private establecimientosSrv: EstablecimientosService,
    private modal: NzModalService,
    private notif: NzNotificationService
  ){}

  ngOnInit(): void {
    this.cargarDatos();
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  cargarDatos(){
    this.cargandoDatos = true;
    this.establecimientosSrv.get(new HttpParams())
    .pipe(finalize(() => this.cargandoDatos = false))
    .subscribe((establecimientos) => this.lstEstablecimientos = establecimientos );
  }

  confirmarEliminacion(establecimiento: EstablecimientoDTO){
    this.modal.confirm({
      nzTitle: `¿Desea eliminar el establecimiento?`,
      nzContent: `${establecimiento.id} - ${establecimiento.denominacion}`,
      nzOkDanger: true,
      nzOkText: 'Eliminar',
      nzOnOk: () => this.eliminar(establecimiento.id)  
    })
  }

  eliminar(id: number){
    this.establecimientosSrv.delete(id)
    .subscribe(() => {
      this.notif.success('<strong>Éxito</strong>', 'Establecimiento eliminado');
      this.cargarDatos();
    });
  }

}
