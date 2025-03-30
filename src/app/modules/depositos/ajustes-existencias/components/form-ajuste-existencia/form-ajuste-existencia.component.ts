import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AjusteExistenciaDTO } from '@dto/depositos/ajuste-existencia.dto';
import { AjusteMaterialIdentificableDTO } from '@dto/depositos/ajuste-material-identificable.dto';
import { MaterialIdentificableDTO } from '@dto/depositos/material-identificable.dto';
import { MaterialDTO } from '@dto/depositos/material.dto';
import { AjustesExistenciasService } from '@services/depositos/ajustes-existencias.service';
import { MaterialesService } from '@services/depositos/materiales.service';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { ResponsiveSizes } from '@util/responsive/responsive-sizes.interface';
import { ResponsiveUtils } from '@util/responsive/responsive-utils';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { catchError, defer, EMPTY, finalize, forkJoin, mergeMap, Observable, of } from 'rxjs';

@Component({
  selector: 'app-form-ajuste-existencia',
  templateUrl: './form-ajuste-existencia.component.html',
  styleUrls: ['./form-ajuste-existencia.component.scss']
})
export class FormAjusteExistenciaComponent implements OnInit {

  @Input()
  idmaterial?: number;

  @Output()
  idajusteExistenciaChange = new EventEmitter<string>();

  idajusteExistencia: string = 'nuevo';
  guardando: boolean = false;
  materialSeleccionado?: MaterialDTO; 
  loadingAjuste: boolean = false;
  lstMateriales: MaterialDTO[] = [];
  loadingMateriales: boolean = false;
  unidadMedidaMaterial?: 'UD' | 'MT';
  lstAjustesIdentificables: AjusteMaterialIdentificableDTO[] = [];

  readonly LABEL_SIZES = ResponsiveUtils.DEFAULT_FORM_LABEL_SIZES;
  readonly CONTROL_SIZES = ResponsiveUtils.DEFALUT_FORM_CONTROL_SIZES;
  readonly HALF_CONTROL_SIZES: ResponsiveSizes = { xs: 24, sm: 24, md: 24, lg: 12, xl: 12, xxl: 12 };
  readonly ACTION_SIZES = ResponsiveUtils.DEFAULT_FORM_ACTIONS_SIZES;

  form = new FormGroup({
    idmaterial: new FormControl<number | null>(null, [Validators.required]),
    cantidadNueva: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
  });

  constructor(
    private materialesSrv: MaterialesService,
    private ajustesExistenciasSrv: AjustesExistenciasService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private notif: NzNotificationService,
    private aroute: ActivatedRoute,
    private modal: NzModalService
  ){}

  ngOnInit(): void {
    const idajusteStr = this.aroute.snapshot.paramMap.get('idajusteexistencia');
    this.idajusteExistencia = Number.isInteger(Number(idajusteStr)) ? `${idajusteStr}` : 'nuevo';
    this.cargarMateriales();

    if(this.idmaterial != null){
      console.log('idmaterial no null', this.idmaterial)
      this.form.controls.idmaterial.setValue(this.idmaterial);
      const consulta: {
        material: Observable<MaterialDTO>,
        identificables?: Observable<MaterialIdentificableDTO[]>,
        ajustesIdentificables?: Observable<AjusteMaterialIdentificableDTO[]>
      } = {
        material: this.cargarMaterialObs(this.idmaterial)
      };
      forkJoin(consulta).pipe(
        mergeMap(resp => {
          return forkJoin({
            material: of(resp.material),
            identificables: resp.material.identificable ?
              this.materialesSrv.getMaterialIdentificableByMaterial(
                Number(this.idmaterial),
                new HttpParams().append('sort', '-disponible')
              ) : EMPTY,
            ajustesIdentificables: resp.material.identificable ?
              this.ajustesExistenciasSrv.getAjustesIdentificables(
                new HttpParams().append('idajusteexistencia', this.idajusteExistencia).append('idmaterial', `${this.idmaterial}`)
              ) : EMPTY
          })
        })
      ).subscribe({
        next: (resp) => {
          this.cargarMaterialNext(resp.material);
          if(this.idajusteExistencia == 'nuevo'){
            this.lstAjustesIdentificables = resp.identificables.map(mi => {
              return {
                idmaterial: mi.idmaterial,
                serial: mi.serial,
                bajanueva: false, //agregar luego
                disponibilidadnueva: mi.disponible
              }  
            });
          } else this.lstAjustesIdentificables = resp.ajustesIdentificables;
        },
        error: (e) => {
          console.error('error al cargar datos', e);
          this.httpErrorHandler.process(e);
        }
      })
    }
    if(this.idajusteExistencia != 'nuevo') this.cargarAjuste();
  }

  cargarAjuste(){
    this.cargarAjusteObs(Number(this.idajusteExistencia))
      .subscribe(ajuste => this.cargarAjusteNext(ajuste));
  }

  private cargarAjusteNext(ajuste: AjusteExistenciaDTO){
    this.form.controls.idmaterial.setValue(ajuste.idmaterial);
    this.form.controls.cantidadNueva.setValue(Number(ajuste.cantidadnueva));
  }

  private cargarAjusteObs(idajusteExistencia: number): Observable<AjusteExistenciaDTO>{
    return defer(() => {
      this.loadingAjuste = true;
      return this.ajustesExistenciasSrv
        .getById(idajusteExistencia)
        .pipe(
          finalize(() => this.loadingAjuste = false),
          catchError(e => {
            console.error('Error al cargar ajuste', e);
            this.httpErrorHandler.process(e);
            throw e;
          })
        );
    });
  }

  private cargarMaterialObs(idmaterial: number): Observable<MaterialDTO>{
    return this.materialesSrv
      .getPorId(idmaterial)
      .pipe(
        catchError(e => {
          console.error('Error al cargar manterial', e);
          this.httpErrorHandler.process(e);
          throw e;
        })
      );
  }

  private cargarMaterialNext(material: MaterialDTO){
    console.log('cargar material next', material)
    this.materialSeleccionado = material;
    this.unidadMedidaMaterial = <'UD' | 'MT'> material.unidadmedida;
    if(this.idajusteExistencia == 'nuevo')
      this.form.controls.cantidadNueva.setValue(Number(material.cantidad));
  }

  cargarMaterial(){
    console.log('ccargando material');
    this.cargarMaterialObs(Number(this.idmaterial)).subscribe(
      material => this.cargarMaterialNext(material)
    );
  }

 /**
  * 
  * continuar desde aqui, separar en obs y next
  */
  cargarIdentificables(idmaterial: number){
    this.materialesSrv
      .getMaterialIdentificableByMaterial(idmaterial, new HttpParams())
      .subscribe({
        next: (identificables) => {
          this.lstAjustesIdentificables = identificables.map(ide => {
            return {
              idmaterial: ide.idmaterial,
              serial: ide.serial,
              disponibilidadnueva: ide.disponible
            }
          })
        },
        error: (e) => {
          console.log('Error al cargar identificables', e);
          this.httpErrorHandler.process(e);
        }
      })
  }

  cargarMateriales(){
    let params = new HttpParams()
      .append('eliminado', false);
    this.loadingMateriales = true;
    this.materialesSrv.get(params)
      .pipe(finalize(() => this.loadingMateriales = false))
      .subscribe({
        next: (materiales) => {
          this.lstMateriales = materiales
          this.materialSeleccionado = this.lstMateriales.find(m => m.id == this.idmaterial);
        },
        error: (e) => {
          console.error('Error al cargar materiales', e);
          this.httpErrorHandler.process(e);
        }
      })
  }

  guardar(){
    Object.keys(this.form.controls).forEach(ctrlName => {
      this.form.get(ctrlName)?.markAsDirty();
      this.form.get(ctrlName)?.updateValueAndValidity();
    });
    if(!this.form.valid) return;
    if(this.idajusteExistencia == 'nuevo') this.regisrar();      
    else this.editar();
  }

  private regisrar(){
    this.guardando = true;
    this.ajustesExistenciasSrv.post(this.getDTO())
      .pipe(finalize(() => this.guardando = false))
      .subscribe((id) => {
        this.idajusteExistenciaChange.emit(id.toString());
        this.idajusteExistencia = id.toString();
        this.notif.success(`<strong>Éxito</strong>`, 'Ajuste de existencias registrado');
      })
  }

  private editar(){
    this.guardando = true;
    this.ajustesExistenciasSrv
      .put(Number(this.idajusteExistencia), this.getDTO())
      .pipe(finalize(() => this.guardando = false))
      .subscribe(() => {
        this.notif.success(`<strong>Éxito</strong>`, 'Ajuste de existencias registrado');
        this.idajusteExistenciaChange.emit(this.idajusteExistencia);
      });
  }

  private getDTO(): AjusteExistenciaDTO{
    return {
      idmaterial: this.form.controls.idmaterial.value ?? -1,
      cantidadnueva: `${this.form.controls.cantidadNueva.value}`,
      ajustesmaterialesidentificables: this.lstAjustesIdentificables
    }
  }

  calcularCantidadIdentificables(){
    const cantidad = this.lstAjustesIdentificables.reduce((accumulator, currentValue) => {
      if(!currentValue.bajanueva && currentValue.disponibilidadnueva){
        console.log('disponible')
        return accumulator + 1;
      }
        
      else return accumulator;
    }, 0);
    this.form.controls.cantidadNueva.setValue(cantidad);
  }

  bajaChange(baja: boolean, serial: string){
    if(baja) this.lstAjustesIdentificables.map(ajusteIdent => {
      if(ajusteIdent.serial == serial) ajusteIdent.disponibilidadnueva = false;
      return ajusteIdent;
    });
    this.calcularCantidadIdentificables();
  }
  disponibilidadChange(){
    this.calcularCantidadIdentificables();
  }

}
