import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SuscripcionesService } from '@services/suscripciones.service';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { ClientesService } from '@services/clientes.service';
import { Cliente } from '@dto/cliente-dto';
import { Suscripcion } from '@dto/suscripcion-dto';
import { forkJoin, mergeMap, of } from 'rxjs';

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

  cargarDatos() {
    if(this.idsuscripcion == null) return;

    this.suscripcionSrv.getPorId(this.idsuscripcion)
    .pipe(mergeMap(susc => 
      forkJoin({
        suscripcion: of(susc),
        cliente: this.clientesSrv.getPorId(susc.idcliente ?? -1)
      })
    ))
    .subscribe({
      next: (resp) => {
        this.suscripcion = resp.suscripcion;
        this.cliente = resp.cliente
      },
      error: (e) => {
        console.error('Error al cargar suscripcion por id', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

  ngOnInit(): void {
    const idsus = this.aroute.snapshot.paramMap.get('idsuscripcion');
    const idcuo = this.aroute.snapshot.paramMap.get('idcuota');

    if (idsus != null) this.idsuscripcion = Number(idsus);
    if (idcuo != null) this.idcuota = idcuo;
    
    this.cargarDatos();
  }

}
