import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cliente } from '@dto/cliente-dto';
import { Suscripcion } from '@dto/suscripcion-dto';
import { ClientesService } from '@servicios/clientes.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';

@Component({
  selector: 'app-pagos-cliente',
  templateUrl: './pagos-cliente.component.html',
  styleUrls: ['./pagos-cliente.component.scss']
})
export class PagosClienteComponent implements OnInit {

  idcliente: number | null = null;
  cliente: Cliente | null = null;
  paramsFiltros: IParametroFiltro = {};
  drawerFiltrosVisible: boolean = false;
  cantFiltrosAplicados: number = 0;
  lstSuscripciones: Suscripcion[] = [];
  loadingSuscripciones: boolean = false;

  constructor(
    private aroute: ActivatedRoute,
    private clienteSrv: ClientesService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    const idclienteRouteParam: string | null = this.aroute.snapshot.paramMap.get('idcliente');
    if (idclienteRouteParam != null && !Number.isNaN(Number(idclienteRouteParam))) {
      this.idcliente = Number(idclienteRouteParam);
      this.clienteSrv.getPorId(Number(this.idcliente)).subscribe({
        next: (cliente) => {
          this.cliente = cliente;
        },
        error: (e) => {
          console.error('Error al cargar cliente por id', e);
          this.httpErrorHandler.process(e);
        }
      })
      this.cargarSuscripciones();
    }

  }

  cargarSuscripciones() {
    const params = new HttpParams().append('eliminado', 'false');
    if (!Number.isNaN(Number(this.idcliente))) {
      this.loadingSuscripciones = true;
      this.clienteSrv.getSuscripcionesPorCliente(Number(this.idcliente), params).subscribe({
        next: (suscripciones) => {
          this.lstSuscripciones = suscripciones;
          this.loadingSuscripciones = false;
        },
        error: (e) => {
          console.error('Error al cargar suscripciones', e);
          this.httpErrorHandler.process(e);
          this.loadingSuscripciones = false;
        }
      })
    }

  }

  getHttpParams(): HttpParams {
    let params = new HttpParams();
    return params;
  }

}
