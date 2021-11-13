import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServerResponseList } from 'src/app/dto/server-response-list.dto';
import { Cliente } from '../../../dto/cliente-dto';
import { Suscripcion } from '../../../dto/suscripcion-dto';
import { SuscripcionesService } from '../../../servicios/suscripciones.service';
import { HttpErrorResponseHandlerService } from '../../../util/http-error-response-handler.service';
import { ClientesService } from '../../../servicios/clientes.service';

@Component({
  selector: 'app-cuotas-suscripciones',
  templateUrl: './cuotas-suscripciones.component.html',
  styleUrls: ['./cuotas-suscripciones.component.scss']
})
export class CuotasSuscripcionesComponent implements OnInit {

  idsuscripcion: number | null = null
  cliente: Cliente | null = null;
  suscripcion: Suscripcion | null = null;

  constructor(
    private aroute: ActivatedRoute,
    private suscripcionesSrv: SuscripcionesService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private clientesSrv: ClientesService
  ) { }

  ngOnInit(): void {
    const idsus: string | null = this.aroute.snapshot.paramMap.get('idsuscripcion');
    if (idsus) {
      this.idsuscripcion = +idsus;
      this.cargarSuscripcion();
    }
  }

  private cargarSuscripcion(){
    if(this.idsuscripcion){
      this.suscripcionesSrv.getPorId(this.idsuscripcion).subscribe((response: Suscripcion)=>{
        this.suscripcion = response;
        this.cargarCliente();
      }, (e)=>{
        console.log(`Error al cargar suscripcion con codigo ${this.idsuscripcion}`);
        console.log(e);
        this.httpErrorHandler.handle(e);
      });
    }
  }

  private cargarCliente(){
    if(this.suscripcion?.idcliente){
      this.clientesSrv.getPorId(this.suscripcion.idcliente).subscribe((resp: Cliente)=>{
        this.cliente = resp;
      }, (e)=>{
        console.log(`Error al cargar cliente con codigo ${this.suscripcion?.idcliente}`);
        console.log(e);
        this.httpErrorHandler.handle(e);
      });
    }
  }

}
