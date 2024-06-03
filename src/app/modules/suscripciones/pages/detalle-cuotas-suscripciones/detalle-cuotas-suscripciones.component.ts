import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SuscripcionesService } from '@global-services/suscripciones.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { ClientesService } from '@global-services/clientes.service';
import { Cliente } from '@dto/cliente-dto';
import { Suscripcion } from '@dto/suscripcion-dto';

@Component({
  selector: 'app-detalle-cuotas-suscripciones',
  templateUrl: './detalle-cuotas-suscripciones.component.html',
  styleUrls: ['./detalle-cuotas-suscripciones.component.scss']
})
export class DetalleCuotasSuscripcionesComponent implements OnInit {

  cliente: Cliente | null = null;
  suscripcion: Suscripcion | null = null;

  idsuscripcion: number | null = null;
  idcuota: string = 'nueva';

  constructor(
    private aroute: ActivatedRoute,
    private suscripcionSrv: SuscripcionesService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private clientesSrv: ClientesService
  ) { }

  cargarSuscripcion() {
    if (this.idsuscripcion) {
      this.suscripcionSrv.getPorId(this.idsuscripcion).subscribe((s: Suscripcion) => {
        this.suscripcion = s;
        this.cargarCliente();
      }, (e) => {
        console.log('Error al cargar suscripcion en detalle de cuota');
        console.log(e);
        this.httpErrorHandler.handle(e);
      });
    }
  }

  cargarCliente() {
    if(this.suscripcion?.idcliente){
      this.clientesSrv.getPorId(this.suscripcion.idcliente).subscribe((c: Cliente)=>{
        this.cliente = c;
      }, (e)=>{
        console.log('Error al cargar cliente en detalle de cuota');
        console.log(e);
        this.httpErrorHandler.handle(e);
      });
    }
  }

  ngOnInit(): void {
    const idsus = this.aroute.snapshot.paramMap.get('idsuscripcion');
    const idcuo = this.aroute.snapshot.paramMap.get('idcuota');
    if (idsus) {
      this.idsuscripcion = +idsus;
    }
    if (idcuo) {
      this.idcuota = idcuo;
    }
    this.cargarSuscripcion();
  }

}
