import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MaterialDTO } from '@dto/material.dto';
import { FinalizacionReclamoDTO } from '@global-dtos/reclamos/finalizacion-reclamo.dto';
import { MaterialUtilizadoDTO } from '@global-dtos/reclamos/material-utilizado.dto';
import { ReclamoDTO } from '@global-dtos/reclamos/reclamo.dto';
import { MaterialesService } from '@global-services/depositos/materiales.service';
import { ReclamosService } from '@global-services/reclamos/reclamos.service';
import { ResponsiveUtils } from '@global-utils/responsive/responsive-utils';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subscription, finalize } from 'rxjs';

@Component({
  selector: 'app-form-finalizar-reclamo',
  templateUrl: './form-finalizar-reclamo.component.html',
  styleUrls: ['./form-finalizar-reclamo.component.scss']
})
export class FormFinalizarReclamoComponent implements OnInit, OnDestroy {

  readonly LABEL_SIZES = ResponsiveUtils.DEFAULT_FORM_LABEL_SIZES;
  readonly CONTROL_SIZES = ResponsiveUtils.DEFALUT_FORM_CONTROL_SIZES;

  reclamo?: ReclamoDTO;
  lstMaterialUtilizado: MaterialUtilizadoDTO[] = [];
  
  idreclamo: string = '';
  modalMaterialesVisible: boolean = false;

  lstMateriales: MaterialDTO[] = [];
  mapTiposMateriales = new Map<string, MaterialDTO[]>();
  
  loadingGuardar: boolean = false;
  loadingMateriales: boolean = false;
  
  formEstado = new FormGroup({
    estado: new FormControl<string | null>(null, [Validators.required]),
    observacionestado: new FormControl<string | null>(null, [Validators.maxLength(30)]),
    personarecepciontecnico: new FormControl<string | null>(null, [Validators.required, Validators.maxLength(50)])
  })

  formMaterial = new FormGroup({
    idmaterial: new FormControl(null, [Validators.required]),
    cantidad: new FormControl(null, [Validators.required, Validators.min(0)])
  });

  estadoSubscription!: Subscription;

  constructor(
    private aroute: ActivatedRoute,
    private router: Router,
    private materialesSrv: MaterialesService,
    private reclamosSrv: ReclamosService,
    private modal: NzModalService,
    private messages: NzMessageService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ){}

  ngOnDestroy(): void {
    this.estadoSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    const strIdreclamo = this.aroute.snapshot.paramMap.get('idreclamo');
    if(Number.isInteger(Number(strIdreclamo))) this.idreclamo = `${strIdreclamo}`;
    else this.router.navigate(['/app/asignacionesreclamos']);
    this.cargarMateriales();
    this.cargarDatos(Number(this.idreclamo));
    this.estadoSubscription = this.formEstado.controls.estado.valueChanges.subscribe(value => {
      if(value == 'OTR') this.formEstado.controls.observacionestado.addValidators([Validators.required, Validators.maxLength(30)]);
      else {
        this.formEstado.controls.observacionestado.clearValidators();
        this.formEstado.controls.observacionestado.reset();
      }
    })
  }

  cargarDatos(idreclamo: number){
    this.reclamosSrv
      .getPorId(idreclamo)
      .subscribe((reclamo) => {
        this.reclamo = reclamo;
        if(reclamo.estado == 'FIN' || reclamo.estado == 'OTR'){          
          this.formEstado.controls.estado.setValue(reclamo.estado);
          this.formEstado.controls.observacionestado.setValue(reclamo.observacionestado ?? null);
          this.formEstado.controls.personarecepciontecnico.setValue(reclamo.personarecepciontecnico ?? null)
        }
    });
    const params = new HttpParams().append('eliminado', false);
    this.reclamosSrv
      .getMaterialesUtilizados(idreclamo, params)
      .subscribe((materialesUtilizados)=> {
        this.lstMaterialUtilizado = materialesUtilizados;
      });
  }

  mostrarModalMateriales(){
    this.modalMaterialesVisible = true;
  }

  ocultarModalMateriales(){
    this.modalMaterialesVisible = false;
  }

  agregarMaterial(){
    Object.keys(this.formMaterial.controls).forEach(key => {      
      this.formMaterial.get(key)?.markAsDirty();
      this.formMaterial.get(key)?.updateValueAndValidity();
    });
    
    if(!this.formMaterial.valid) return;
    
    const materialUtilizado = this.lstMaterialUtilizado.find(mu => mu.idmaterial == this.formMaterial.controls.idmaterial.value);
    const idxMaterialUtilizado = this.lstMaterialUtilizado.findIndex(mu => mu.idmaterial == this.formMaterial.controls.idmaterial.value);
    if(materialUtilizado){
      materialUtilizado.cantidad = `${Number(materialUtilizado.cantidad) + Number(this.formMaterial.controls.cantidad.value)}`
      let tmpLstMaterialUtilizado = [...this.lstMaterialUtilizado];
      tmpLstMaterialUtilizado[idxMaterialUtilizado] = materialUtilizado;
      this.lstMaterialUtilizado = tmpLstMaterialUtilizado;
    }else {
      this.lstMaterialUtilizado = this.lstMaterialUtilizado.concat([{
        id: this.lstMaterialUtilizado.length,
        idreclamo: Number(this.idreclamo),
        idmaterial: Number(this.formMaterial.controls.idmaterial.value),
        unidadmedida: this.lstMateriales.find(m => m.id == this.formMaterial.controls.idmaterial.value)?.unidadmedida,
        cantidad: `${this.formMaterial.controls.cantidad.value}`,
        descripcion: `${this.lstMateriales.find(m => m.id == this.formMaterial.controls.idmaterial.value)?.descripcion}`.toUpperCase(),
        eliminado: false
      }]);
    }

    this.formMaterial.reset();
    this.messages.success('Material agregado.');
  }

  cargarMateriales(){
    this.loadingMateriales = true;
    let params = new HttpParams();
    params = params.append('eliminado', false);
    this.materialesSrv.get(params)
      .pipe(finalize(() => this.loadingMateriales = false))
      .subscribe({
        next: (materiales) => {
          this.lstMateriales = materiales;
          this.mapTiposMateriales.clear();
          for(let material of materiales) this.mapTiposMateriales.set(
            material.tipomaterial ?? '(sin grupo)',
            (this.mapTiposMateriales.get(material.tipomaterial ?? '(sin grupo)') ?? []).concat(material)
          );  
        },
        error: (e) => {
          console.log('Error al cargar materiales', e);
          this.httpErrorHandler.process(e);
        }
      });
  }

  confirmarEliminarMaterialUtilizado(material: MaterialUtilizadoDTO){
    this.modal.confirm({
      nzTitle: '¿Desea eliminar el material?',
      nzContent: `${material.descripcion}, ${material.cantidad} ${material.unidadmedida == 'UD' ? 'uds.' : 'mts.'}`,
      nzOkText: 'Eliminar',
      nzOkDanger: true,
      nzOnOk: () => this.eliminarMaterial(material.id)
    })
  }

  eliminarMaterial(idmaterialutilizado: number){
    this.lstMaterialUtilizado = this.lstMaterialUtilizado.filter(mu => mu.id != idmaterialutilizado);
    this.messages.success('Material eliminado.');
  }

  guardar(){
    Object.keys(this.formEstado.controls).forEach(key => {
      this.formEstado.get(key)?.markAsDirty();
      this.formEstado.get(key)?.updateValueAndValidity();
    });
    if(this.formEstado.valid && this.reclamo?.estado == 'PRO') this.registrar();
    if(this.formEstado.valid && (this.reclamo?.estado == 'FIN' || this.reclamo?.estado == 'OTR')) this.editar();
  }

  private registrar(){
    this.loadingGuardar = true;
    this.reclamosSrv.finalizarReclamo(Number(this.idreclamo), this.getDto())
      .pipe(finalize(() => this.loadingGuardar = false))
      .subscribe(() => {
        this.messages.success('Reclamo finalizado.');
        this.cargarDatos(Number(this.idreclamo));
      });
  }

  private editar(){
    this.loadingGuardar = true;
    this.reclamosSrv.editarFinalizacionReclamo(Number(this.idreclamo), this.getDto())
      .pipe(finalize(() => this.loadingGuardar = false))
      .subscribe(() => {
        this.messages.success('Reclamo Editado.');
      })
  }

  private getDto(): FinalizacionReclamoDTO{
    return {
      estado: this.formEstado.controls.estado.value ?? 'FIN',
      observacionestado: this.formEstado.controls.observacionestado.value ?? undefined,
      personarecepciontecnico: this.formEstado.controls.personarecepciontecnico.value ?? '',
      materialesutilizados: this.lstMaterialUtilizado
    }
  }

}
