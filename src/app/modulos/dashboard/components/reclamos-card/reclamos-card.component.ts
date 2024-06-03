import { HttpParams } from '@angular/common/http';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ReclamosService } from '@global-services/reclamos/reclamos.service';
import { SesionService } from '@global-services/sesion.service';

@Component({
  selector: 'app-reclamos-card',
  templateUrl: './reclamos-card.component.html',
  styleUrls: ['./reclamos-card.component.scss']
})
export class ReclamosCardComponent implements OnInit, OnDestroy {

  cardSize: 'small' | 'default' = 'default';

  enProceso: number = 0;
  pendientes: number = 0;
  postergados: number = 0;

  interval?: any;
  readonly RELOAD_TIME_MILLIS = 30000;

  constructor(
    private reclamosSrv: ReclamosService,
    private sesionSrv: SesionService
  ){}

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  ngOnInit(): void {
    this.onWindowResize();
    this.cargarDatos();
    this.interval = setInterval(() => {
      this.cargarDatos();
    }, this.RELOAD_TIME_MILLIS);
  }

  @HostListener('window:resize')
  onWindowResize(){
    if(window.innerWidth >= 576) this.cardSize = 'default';
    else this.cardSize = 'small';
  }

  private cargarDatos(){
    this.cargarPendientes();
    this.cargarEnProceso();
    this.cargarPostergados();
  }

  private cargarPendientes(){
    const params =
      new HttpParams()
      .append('eliminado', false)
      .append('idusuarioresponsable', this.sesionSrv.idusuario)
      .append('estado', 'ASI');
    this.reclamosSrv
      .getTotal(params)
      .subscribe(totalPendientes => {
        this.pendientes = totalPendientes
      });
  }

  private cargarEnProceso(){
    const params =
      new HttpParams()
      .append('eliminado', false)
      .append('idusuarioresponsable', this.sesionSrv.idusuario)
      .append('estado', 'PRO');
    this.reclamosSrv
      .getTotal(params)
      .subscribe(totalEnProceso => {
        this.enProceso = totalEnProceso;
      })
  }

  private cargarPostergados(){
    const params =
      new HttpParams()
      .append('eliminado', false)
      .append('idusuarioresponsable', this.sesionSrv.idusuario)
      .append('estado', 'POS');
    this.reclamosSrv
      .getTotal(params)
      .subscribe(totalPostergados => {
        this.postergados = totalPostergados;
      })
  }

}
