import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DetalleReclamoDTO } from '@global-dtos/reclamos/detalle-reclamo.dto';
import { ReclamoDTO } from '@global-dtos/reclamos/reclamo.dto';
import { ReclamosService } from '@global-services/reclamos/reclamos.service';
import { SesionService } from '@servicios/sesion.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { finalize, forkJoin, mergeMap, of } from 'rxjs';

@Component({
  selector: 'app-detalle-asignacion-reclamo',
  templateUrl: './detalle-asignacion-reclamo.component.html',
  styleUrls: ['./detalle-asignacion-reclamo.component.scss']
})
export class DetalleAsignacionReclamoComponent implements OnInit {

  idreclamo: string = ''
  reclamo: ReclamoDTO | null = null;
  lstDetallesReclamo: DetalleReclamoDTO[] = [];
  loadingReclamo: boolean = false;
  loadingDetalles: boolean = false;
  loadingAsignacion: boolean = false;
  loadingProcesar: boolean = false;
  loadingPostergar: boolean = false;

  constructor(
    private reclamosSrv: ReclamosService,
    private aroute: ActivatedRoute,
    private router: Router,
    private sesionSrv: SesionService,
    private notif: NzNotificationService,
    private modal: NzModalService,
    private message: NzMessageService
  ){}

  ngOnInit(): void {
    const strIdreclamo = this.aroute.snapshot.paramMap.get('idreclamo');
    if(Number.isInteger(Number(strIdreclamo))) this.idreclamo = `${strIdreclamo}`;
    else this.router.navigate(['/app/asignacionesreclamos']);
    this.cargarReclamo(Number(strIdreclamo));
    this.cargarDetalles(Number(strIdreclamo));
  }

  cargarReclamo(idreclamo: number){
    this.loadingReclamo = true;
    this.reclamosSrv.getPorId(idreclamo)
      .pipe(finalize(() => this.loadingReclamo = false))
      .subscribe({
        next: (reclamo) => {
          this.reclamo = reclamo;
        }
      });
  }

  cargarDetalles(idreclamo: number){
    this.loadingDetalles = true;
    const params = new HttpParams().append('eliminado', false);
    this.reclamosSrv.getDetallesByReclamo(idreclamo, params)
      .pipe(finalize(() => this.loadingDetalles = false))
      .subscribe((detalles) => {
          this.lstDetallesReclamo = detalles;
      });
  }

  confirmarAsignacion(reclamo: ReclamoDTO){
    this.modal.confirm({
      nzTitle: '¿Desea tomar el reclamo?',
      nzOkText: 'Tomar',
      nzOnOk: () => this.asignar(reclamo.id ?? -1)
    })
  }

  asignar(idreclamo: number){
    this.loadingAsignacion = true;
    this.reclamosSrv.asignarReclamo(idreclamo, this.sesionSrv.idusuario)
      .pipe(finalize(() => this.loadingAsignacion = false))
      .subscribe(() => {
        this.message.success('Reclamo asignado');
        //this.notif.success(`<strong>Éxito</strong>`, 'Reclamo asignado');
        this.cargarReclamo(idreclamo);
      })
  }

  confirmarLiberacion(reclamo: ReclamoDTO){
    this.modal.confirm({
      nzTitle: `¿Desea liberar el reclamo?`,
      nzOkText: 'Liberar',
      nzOnOk: () => this.liberar(reclamo.id ?? -1)
    })
  }

  liberar(idreclamo: number){
    this.loadingAsignacion = true;
    this.reclamosSrv.liberarReclamo(idreclamo)
      .pipe(finalize(() => this.loadingAsignacion = false))
      .subscribe(() => {
        this.message.success('Reclamo liberado');
        //this.notif.success(`<strong>Éxito</strong>`, 'Reclamo liberado');
        this.cargarReclamo(idreclamo);
      })
  }

  confirmarProceso(reclamo: ReclamoDTO){
    this.modal.confirm({
      nzTitle: '¿Desea poner el reclamo En Proceso?',
      nzOkText: 'Procesar',
      nzOnOk: () => this.procesar(reclamo.id ?? -1)
    })
  }

  verificarProceso(){
    this.loadingProcesar = true;
    let params = new HttpParams();
    params = params.append('eliminado', false);
    params = params.append('idusuarioresponsable', this.sesionSrv.idusuario);
    params = params.append('estado', 'PRO');
    this.reclamosSrv.get(params)
    .subscribe({
      next: (reclamos) => {
        if(reclamos.length > 0){
          this.message.error(`El reclamo #${reclamos[0].id} aún está en proceso.`);
          this.loadingProcesar = false;
        } else this.procesar(Number(this.idreclamo));
      },
      error: (e) => this.loadingProcesar = false
    });
  }

  procesar(idreclamo: number){
    this.reclamosSrv.cambiarEstado(idreclamo, 'PRO')
      .pipe(finalize(() => this.loadingProcesar = false))
      .subscribe(() => {
        this.message.success('Reclamo en proceso');
        this.cargarReclamo(idreclamo);
      });
   /* let params = new HttpParams();
    params = params.append('eliminado', false);
    params = params.append('idusuarioresponsable', this.sesionSrv.idusuario);
    params = params.append('estado', 'PRO');
    this.reclamosSrv.get(params)
      .pipe(
        mergeMap(reclamos => {
          if(reclamos.length == 0) return forkJoin({
            reclamos: of(reclamos),
            cambioEstado: this.reclamosSrv.cambiarEstado(idreclamo, 'PRO')
          });
          else return forkJoin({
            reclamos: of(reclamos)
          })
        }),
        finalize(() => this.loadingProcesar = false)
      )
      .subscribe((resp) => {
        if(resp.reclamos.length > 0) this.message.error(`El reclamo #${resp.reclamos[0].id} aún está en proceso.`);
        else {
          this.message.success('Reclamo en proceso');
          this.cargarReclamo(idreclamo);
        }
      });*/
  }

  confirmarPostergacion(reclamo: ReclamoDTO){
    this.modal.confirm({
      nzTitle: '¿Desea postergar el reclamo?',
      nzOkText: `Postergar`,
      nzOnOk: () => this.postergar(reclamo.id ?? -1)
    });
  }

  postergar(idreclamo: number){
    this.loadingPostergar = true;
    this.reclamosSrv.cambiarEstado(idreclamo, 'POS')
      .pipe(finalize(() => this.loadingPostergar = false))
      .subscribe(() => {
        this.message.success('Reclamo postergado');
        //this.notif.success(`<strong>Éxito</strong>`, 'Reclamo Postergado.');
        this.cargarReclamo(idreclamo);
      });
  }

}
