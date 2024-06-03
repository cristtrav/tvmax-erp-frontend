import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cliente } from '@dto/cliente-dto';
import { Suscripcion } from '@dto/suscripcion-dto';
import { ClientesService } from '@services/clientes.service';
import { SuscripcionesService } from '@services/suscripciones.service';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { forkJoin, mergeMap, of } from 'rxjs';


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
    this.idsuscripcion = Number.isInteger(Number(idsus)) ? Number(idsus) : null;
    this.cargarSuscripcionCliente();
  }

  private cargarSuscripcionCliente(){
    if(this.idsuscripcion == null) return;

    this.suscripcionesSrv
      .getPorId(this.idsuscripcion)
      .pipe(mergeMap(susc => {
        return forkJoin({
          suscripcion: of(susc),
          cliente: this.clientesSrv.getPorId(susc.idcliente ?? -1)
        })
      }))
      .subscribe({
      next: (response) => {
        this.suscripcion = response.suscripcion;
        this.cliente = response.cliente;
      },
      error: (e) => {
        console.log(`Error al cargar`, e);          
        this.httpErrorHandler.process(e);
      }
    });
  }

}
