import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CodigoSeguridadContribuyenteDTO } from '@dto/facturacion/codigo-seguridad-contribuyente.dto';
import { CodigoSeguridadContribuyenteService } from '@services/facturacion/codigo-seguridad-contribuyente.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-vista-csc',
  templateUrl: './vista-csc.component.html',
  styleUrls: ['./vista-csc.component.scss']
})
export class VistaCscComponent implements OnInit {

  cargandoDatos: boolean = false;
  lstCSC: CodigoSeguridadContribuyenteDTO[] = [];

  constructor(
    private cscSrv: CodigoSeguridadContribuyenteService,
    private modal: NzModalService,
    private notif: NzNotificationService
  ){}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(){
    this.cargandoDatos = true;
    this.cscSrv.get(new HttpParams())
    .pipe(finalize(() => this.cargandoDatos = false))
    .subscribe(lstCsc => this.lstCSC = lstCsc );
  }

  public confirmarEliminacion(csc: CodigoSeguridadContribuyenteDTO){
    this.modal.confirm({
      nzTitle: '¿Desea eliminar el CSC?',
      nzContent: `${csc.id} - ${csc.codigoseguridad}`,
      nzOkDanger: true,
      nzOkText: 'Eliminar',
      nzOnOk: () => this.eliminar(csc.id)
    });
  }

  private eliminar(id: number){
    this.cscSrv.delete(id)
    .subscribe(() => {
      this.notif.success('<strong>Éxito</strong>', 'CSC eliminado');
      this.cargarDatos();
    });
  }

}
