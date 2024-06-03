import { HttpParams } from '@angular/common/http';
import { Component, Inject, InjectionToken, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DetalleReclamoDTO } from '@global-dtos/reclamos/detalle-reclamo.dto';
import { ReclamoDTO } from '@global-dtos/reclamos/reclamo.dto';
import { ReclamosService } from '@global-services/reclamos/reclamos.service';
import { SesionService } from '@global-services/sesion.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { finalize } from 'rxjs';

const NAVIGATOR = new InjectionToken<Navigator>('Navigator object', {
  factory: () => navigator
})

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

  isModalMotivoPosVisible: boolean = false;
  motivoPostergacionCtrl = new FormControl<null | string>(null, [Validators.required, Validators.minLength(4), Validators.maxLength(45)]);

  constructor(
    @Inject(NAVIGATOR) private navigator: Navigator,
    private reclamosSrv: ReclamosService,
    private aroute: ActivatedRoute,
    private router: Router,
    private sesionSrv: SesionService,
    private modal: NzModalService,
    private message: NzMessageService
  ){}

  ngOnInit(): void {
    const strIdreclamo = this.aroute.snapshot.paramMap.get('idreclamo');
    if(Number.isInteger(Number(strIdreclamo))) this.idreclamo = `${strIdreclamo}`;
    else this.router.navigate(['/app/asignacionesreclamos']);
    this.cargarReclamo(Number(strIdreclamo));
    this.cargarDetalles(Number(strIdreclamo));
    this.motivoPostergacionCtrl.dirty
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
        this.cargarReclamo(idreclamo);
      })
  }

  confirmarProceso(reclamo: ReclamoDTO){
    this.modal.confirm({
      nzTitle: '¿Desea poner el reclamo En Proceso?',
      nzOkText: 'Procesar',
      nzOnOk: () => this.verificarProceso(reclamo.id ?? -1)
    })
  }

  verificarProceso(idreclamo: number){
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
        } else this.procesar(idreclamo);
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
  }

  postergar(idreclamo: number){
    this.motivoPostergacionCtrl.markAsDirty();
    this.motivoPostergacionCtrl.updateValueAndValidity();

    if(this.motivoPostergacionCtrl.valid){
      this.loadingPostergar = true;
      this.reclamosSrv.cambiarEstado(idreclamo, 'POS', this.motivoPostergacionCtrl.value)
      .pipe(finalize(() => this.loadingPostergar = false))
      .subscribe(() => {
        this.message.success('Reclamo postergado');
        this.cargarReclamo(idreclamo);
      });
      this.cerrarModalMotivoPos();
    }
  }

  copiarTelefono(){
    if(!this.reclamo?.telefono) return;
    
    this.navigator.clipboard.writeText(this.reclamo.telefono);
    this.message.success('Teléfono copiado');
  }

  mostrarModalMotivoPos(){
    this.isModalMotivoPosVisible = true;
  }

  cerrarModalMotivoPos(){
    this.isModalMotivoPosVisible = false;
  }

}
