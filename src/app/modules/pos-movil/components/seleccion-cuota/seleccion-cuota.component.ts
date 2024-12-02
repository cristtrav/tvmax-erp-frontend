import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Cliente } from '@dto/cliente-dto';
import { CuotaDTO } from '@dto/cuota-dto';
import { Suscripcion } from '@dto/suscripcion-dto';
import { CuotasService } from '@services/cuotas.service';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { SuscripcionesService } from '@services/suscripciones.service';
import { filter, finalize, forkJoin, from, map, mergeMap, of, toArray } from 'rxjs';

@Component({
  selector: 'app-seleccion-cuota',
  templateUrl: './seleccion-cuota.component.html',
  styleUrls: ['./seleccion-cuota.component.scss']
})
export class SeleccionCuotaComponent implements OnInit {

  @Input()
  cliente: Cliente | null = null;

  @Input()
  set omitidos(omitidos: number[]){    
    this._omitidos = omitidos;
    this.lstSuscripcionesCuotas = this.lstSuscripcionesCuotas.map(susCuota => {
      susCuota.cuotas = susCuota.cuotas.filter(cuota => !omitidos.some(id => id == cuota.id));
      return susCuota;
    });
  }
  get omitidos(): number[] {
    return this._omitidos;
  }
  private _omitidos: number[] = [];

  @Output()
  cuotaChange = new EventEmitter<CuotaDTO>();

  lstSuscripcionesCuotas: SuscripcionCuotasInterface[] = [];
  loadingCuotas: boolean = false;
  

  constructor(
    private cuotasSrv: CuotasService,
    private suscripcionesSrv: SuscripcionesService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ){}

  ngOnInit(): void {
    this.cargarCuotas();
  }

  cargarCuotas(){
    const paramsCuotas = new HttpParams()
    .append('eliminado', false)
    .append('pagado', false)
    .append('sort', '+fechavencimiento');

    const paramsSuscripciones = new HttpParams()
    .append('eliminado', false)
    .append('idcliente', this.cliente?.id ?? -1);

    this.loadingCuotas = true;
    this.suscripcionesSrv
    .get(paramsSuscripciones)
    .pipe(
      mergeMap(suscripciones => 
        from(suscripciones) // Convertir el array en una lista de observables
        .pipe(
          mergeMap(suscripcion => //Por cada suscripcion
            forkJoin({
              suscripcion: of(suscripcion), //Convertir a observable
              cuotas: this.cuotasSrv.getCuotasPorSuscripcion(suscripcion.id ?? -1, paramsCuotas) //Consultar cuotas de suscripcion
                .pipe(
                  map(cuotas => 
                    cuotas.filter(cuota => !this.omitidos.some(id => id == cuota.id))//Traer solo las que no esten omitidas
                  )
                )
            })
          )
        )
      ),
      toArray(),
      finalize(() => this.loadingCuotas = false)
    )
    .subscribe({
      next: (susCuotas) => {
        this.lstSuscripcionesCuotas = susCuotas;

      },
      error: (e) => {
        console.error("Error al cargar cuotas", e);
        this.httpErrorHandler.process(e);
      }
    })
  }

  seleccionarCuota(cuota: CuotaDTO){
    this.cuotaChange.emit(cuota);
  }

}

interface SuscripcionCuotasInterface {
  suscripcion: Suscripcion,
  cuotas: CuotaDTO[]
}
