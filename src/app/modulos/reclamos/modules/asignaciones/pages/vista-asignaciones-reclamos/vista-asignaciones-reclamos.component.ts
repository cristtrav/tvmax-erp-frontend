import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ReclamoDTO } from '@global-dtos/reclamos/reclamo.dto';
import { ReclamosService } from '@global-services/reclamos/reclamos.service';
import { SesionService } from '@global-services/sesion.service';
import { concatMap, finalize, forkJoin, from, mergeMap, of, toArray } from 'rxjs';

@Component({
  selector: 'app-vista-asignaciones-reclamos',
  templateUrl: './vista-asignaciones-reclamos.component.html',
  styleUrls: ['./vista-asignaciones-reclamos.component.scss']
})
export class VistaAsignacionesReclamosComponent implements OnInit {

  loadingReclamos: boolean = false;
  lstReclamos: ReclamoDTO[] = [];
  vista: 'asignado' | 'noasignado' = 'asignado';
  loadingMore: boolean = false;
  totalRegistros: number = 0;

  finalizadosVisible: boolean = false;

  constructor(
    private reclamosSrv: ReclamosService,
    private sesionSrv: SesionService
  ){}

  ngOnInit(): void {
    this.cargarReclamos();
  }

  cargarReclamos(){
    this.loadingReclamos = true;
    forkJoin({
      reclamos: this.reclamosSrv.get(this.getHttpParams()),
      total: this.reclamosSrv.getTotal(this.getHttpParams())
    })
    .pipe(
      mergeMap(resp => {
        return forkJoin({
          total: of(resp.total),
          reclamos:
            from(resp.reclamos)
            .pipe(
              concatMap(reclamo => {
                const detalleParams = new HttpParams().append('eliminado', false);
                return this.reclamosSrv.getDetallesByReclamo(reclamo.id ?? -1, detalleParams)
                  .pipe(
                    concatMap(detalles => {
                      reclamo.detalles = detalles;
                      return of(reclamo);
                    })
                  );
              }),
              toArray()
            )
        })
      }),
      finalize(() => this.loadingReclamos = false)
    )
    .subscribe((resp) => {
      this.totalRegistros = resp.total;
      if(!this.finalizadosVisible){
        const reclamosEnProceso = resp.reclamos.filter(r => r.estado == 'PRO');
        const reclamosPendientes = resp.reclamos.filter(r => r.estado == 'PEN');
        const reclamosAsignados = resp.reclamos.filter(r => r.estado == 'ASI');
        const reclamosPospuestos = resp.reclamos.filter(r => r.estado == 'POS');
        this.lstReclamos = [...reclamosEnProceso, ...reclamosPendientes, ...reclamosAsignados, ...reclamosPospuestos];      
      }else this.lstReclamos = resp.reclamos;
    });
  }

  private addParametroEstado(finalizadosVisible: boolean, params: HttpParams): HttpParams{
    if(finalizadosVisible){
      params = params.append('estado', 'FIN');
      params = params.append('estado', 'OTR');
    }else{
      params = params.append('estado', 'PEN');
      params = params.append('estado', 'ASI');
      params = params.append('estado', 'PRO');
      params = params.append('estado', 'POS');
    }
    return params;
  }

  private getHttpParams(): HttpParams{
    let params = new HttpParams();
    params = params.append('eliminado', false);
    params = this.addParametroEstado(this.finalizadosVisible, params);
    if(this.vista == 'asignado') params = params.append('idusuarioresponsable', this.sesionSrv.idusuario);
    else params = params.append('responsableasignado', false);
    params = params.append('limit', 10);
    params = params.append('offset', 0);
    params = params.append('sort', '+id');
    return params;
  }

  cambiarVista(vista: 'asignado' | 'noasignado'){
    this.vista = vista;
    if(vista == 'noasignado') this.finalizadosVisible = false;
    this.cargarReclamos();
  }

  cargarMas(){
    this.loadingMore = true;
    let params = new HttpParams();
    params = params.append(`eliminado`, false);
    params = this.addParametroEstado(this.finalizadosVisible, params);
    params = params.append('responsableasignado', this.vista == 'asignado');
    params = params.append('limit', 10);
    params = params.append('offset', this.lstReclamos.length);
    params = params.append('sort', '+id');
    forkJoin({
      reclamos: this.reclamosSrv.get(params),
      total: this.reclamosSrv.getTotal(params)
    })
      .pipe(finalize(() => this.loadingMore = false))
      .subscribe((resp) => {
        this.totalRegistros = resp.total;
        this.lstReclamos = this.lstReclamos.concat(resp.reclamos);
      })
  }

  mostrarFinalizados(){    
    this.cargarReclamos();
  }

}
