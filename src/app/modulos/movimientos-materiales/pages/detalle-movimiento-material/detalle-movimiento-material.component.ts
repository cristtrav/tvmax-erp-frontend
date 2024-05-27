import { HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MovimientoMaterialDTO } from '@dto/movimiento-material.dto';
import { UsuarioDTO } from '@dto/usuario.dto';
import { MovimientosMaterialesService } from '@servicios/movimientos-materiales.service';
import { SesionService } from '@servicios/sesion.service';
import { UsuariosService } from '@servicios/usuarios.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { finalize, forkJoin } from 'rxjs';
import { TablaDetallesMovimientosComponent } from '../../components/tabla-detalles-movimientos/tabla-detalles-movimientos.component';
import { BuscadorMaterialesComponent } from '../../components/buscador-materiales/buscador-materiales.component';
import { DetalleMovimientoMaterialDTO } from '@dto/detalle-movimiento-material.dto';
import { ImpresionService } from '@servicios/impresion.service';

@Component({
  selector: 'app-detalle-movimiento-material',
  templateUrl: './detalle-movimiento-material.component.html',
  styleUrls: ['./detalle-movimiento-material.component.scss']
})
export class DetalleMovimientoMaterialComponent implements OnInit, AfterViewInit {

  @ViewChild('iframe')
  iframe!: ElementRef<HTMLIFrameElement>;
  @ViewChild(TablaDetallesMovimientosComponent)
  tablaDetallesMovimientosComp!: TablaDetallesMovimientosComponent;
  @ViewChild(BuscadorMaterialesComponent)
  buscadorMaterialesComp!: BuscadorMaterialesComponent;

  loadingImpresion: boolean = false;
  readonly setMostrarUsuarioTipo = new Set<string>(['SA', 'DE', 'EN'])

  idMovimientoMaterial: string = 'nuevo';
  idMovimientoReferencia: string | null = null;
  fechaRetiro: Date | null = null;

  idDetalleEnEdicion: number | null = 0;
  cantidadEnEdicion: number = 1;

  lstUsuarios: UsuarioDTO[] = [];
  guardandoMovimiento: boolean = false;
  loadingUsuarios: boolean = false;

  disabledDate = (current: Date): boolean => {
    if(this.fechaRetiro == null) return false;
    return current < this.fechaRetiro
  }

  formCabecera = new FormGroup({
    fecha: new FormControl(new Date(), [Validators.required]),    
    tipoMovimiento: new FormControl<string | null>(null, [Validators.required]),
    idUsuarioEntrega: new FormControl<number | null>(null, null),
    observacion: new FormControl<string | null>(null, [Validators.maxLength(150)])
  });

  constructor(
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private aroute: ActivatedRoute,
    private router: Router,
    private notif: NzNotificationService,
    private sesionSrv: SesionService,
    private movimientosSrv: MovimientosMaterialesService,
    private impresionSrv: ImpresionService,
    private viewContainerRef: ViewContainerRef,
    private usuariosSrv: UsuariosService
  ){}

  ngAfterViewInit(): void {
    if(this.idMovimientoMaterial == 'nuevo' && this.idMovimientoReferencia != null) this.cargarDatos(Number(this.idMovimientoReferencia));
    if(this.idMovimientoMaterial != 'nuevo') this.cargarDatos(Number(this.idMovimientoMaterial));
  }
  
  ngOnInit(): void {
    this.formCabecera.controls.tipoMovimiento.valueChanges.subscribe(tipo => {
      this.formCabecera.controls.idUsuarioEntrega.clearValidators();
      if(tipo === 'SA') this.formCabecera.controls.idUsuarioEntrega.addValidators(Validators.required);
      this.cargarUsuarios();
    });

    const idmaterialStr = this.aroute.snapshot.paramMap.get('idmovimientomaterial');
    this.idMovimientoMaterial = !Number.isNaN(Number.parseInt(`${idmaterialStr}`)) ? `${idmaterialStr}` : 'nuevo';
    this.idMovimientoReferencia = this.aroute.snapshot.queryParamMap.get('idmovimientoreferencia');
    if(this.idMovimientoReferencia != null) this.formCabecera.controls.tipoMovimiento.setValue('DE');
  }  
  
  cargarDatos(idmovimiento: number){
    const paramsDetalles = new HttpParams().append('eliminado', 'false');
    forkJoin({
      movimiento: this.movimientosSrv.getPorId(idmovimiento),
      detalles: this.movimientosSrv.getDetallesPorIdMovimiento(idmovimiento, paramsDetalles)
    }).subscribe({
      next: (resp) => {
        if(this.idMovimientoMaterial == 'nuevo' && this.idMovimientoReferencia != null)
          this.cargarDatosDevolucion(resp.movimiento, resp.detalles);
        if(this.idMovimientoMaterial != 'nuevo')
          this.cargarDatosEdicion(resp.movimiento, resp.detalles);
      },
      error: (e) => {
        console.error('Error al cargar movimiento y detalles', e);
        this.httpErrorHandler.process(e);
      }
    });
  }

  private cargarDatosEdicion(movimiento: MovimientoMaterialDTO, detalles: DetalleMovimientoMaterialDTO[]){
    console.log('Cargando para edicion');
    if(movimiento.fecharetiro) this.fechaRetiro = new Date(movimiento.fecharetiro);
    this.formCabecera.controls.fecha.setValue(new Date(movimiento.fecha));
    this.formCabecera.controls.idUsuarioEntrega.setValue(movimiento.idusuarioentrega);
    this.formCabecera.controls.tipoMovimiento.setValue(movimiento.tipomovimiento);
    this.formCabecera.controls.observacion.setValue(movimiento.observacion ?? null);
    
    this.tablaDetallesMovimientosComp.lstDetallesMovimientos = detalles.map((detalle) => {
      return {
        id: detalle.id,
        idmaterial: detalle.idmaterial,
        cantidad: Number(detalle.cantidad),
        cantidadretirada: detalle.cantidadretirada != null ? Number(detalle.cantidadretirada) : undefined,
        unidadmedida: detalle.unidadmedida,
        descripcion: detalle.descripcion,
        nroseriematerial: detalle.nroseriematerial,
        materialidentificable: detalle.materialidentificable,
        iddetallemovimientoreferencia: detalle.iddetallemovimientoreferencia,
        eliminado: detalle.eliminado
      }
    });
    this.tablaDetallesMovimientosComp.cargarTodosMaterialesIdentificables();
  }

  private cargarDatosDevolucion(movimiento: MovimientoMaterialDTO, detalles: DetalleMovimientoMaterialDTO[]){
    console.log('Cargando para devolucion');
    this.fechaRetiro = new Date(movimiento.fecha);
    this.formCabecera.controls.fecha.setValue(new Date(movimiento.fecha));
    this.formCabecera.controls.idUsuarioEntrega.setValue(movimiento.idusuarioentrega);

    this.tablaDetallesMovimientosComp.lstDetallesMovimientos = detalles.map((detalle, index) => {
      return {
        id: Number(`${detalle.idmaterial}${index}`),
        idmaterial: detalle.idmaterial,
        cantidad: Number(detalle.cantidad),
        cantidadretirada: Number(detalle.cantidad),
        unidadmedida: detalle.unidadmedida,
        materialidentificable: detalle.materialidentificable,
        nroseriematerial: detalle.nroseriematerial,
        descripcion: detalle.descripcion,
        iddetallemovimientoreferencia: detalle.id,
        eliminado: false,
      }
    });
    this.tablaDetallesMovimientosComp.cargarTodosMaterialesIdentificables();
  }

  cargarUsuarios(){
    let httpParams = new HttpParams().append('eliminado', 'false');
    const tm = this.formCabecera.controls.tipoMovimiento.value
    if(tm == 'EN') httpParams = httpParams.append('idrol', 8);
    else httpParams = httpParams.append('idrol', 7);
    
    this.loadingUsuarios = true;
    this.usuariosSrv.get(httpParams)
    .pipe(finalize(() => this.loadingUsuarios = false))
    .subscribe({
      next: (usuarios) => {
        this.lstUsuarios = usuarios;
      },
      error: (e) => {
        console.error('Error al cargar usuarios', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

  guardar(){
    Object.keys(this.formCabecera.controls).forEach(key => {
      this.formCabecera.get(key)?.markAsDirty();
      this.formCabecera.get(key)?.updateValueAndValidity();
    });
    if(this.formCabecera.valid && this.tablaDetallesMovimientosComp.isDetallesMovimientosValid()){
      if(this.idMovimientoMaterial == 'nuevo') this.registrar();
      else this.editar();
    }
  }

  private registrar(){
    this.guardandoMovimiento = true;
    this.movimientosSrv.post(this.getDto())
    .pipe(finalize(() => this.guardandoMovimiento = false))
    .subscribe({
      next: (idmovimiento) => {
        this.notif.create('success', '<strong>Éxito</strong>', 'Movimiento de materiales registrado.');
        this.idMovimientoMaterial = `${idmovimiento}`;
        this.router.navigate([idmovimiento], {relativeTo: this.aroute.parent});
        this.buscadorMaterialesComp.reset();        
        this.cargarDatos(Number(this.idMovimientoMaterial));
      },
      error: (e) => {
        console.error('Error al registrar movimiento de material', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

  private editar(){ 
    this.movimientosSrv.put(this.getDto()).subscribe({
      next: () => {
        this.notif.create('success', '<strong>Éxito</strong>', 'Editado correctamente.');
        this.buscadorMaterialesComp.reset();
        this.cargarDatos(Number(this.idMovimientoMaterial));
      },
      error: (e) => {
        console.log('Error al editar movimiento de material', e);
        this.httpErrorHandler.process(e);
      }
    });
  }

  private getDto(): MovimientoMaterialDTO{    
    return {
      id: this.idMovimientoMaterial == 'nuevo' ? 0 : Number(this.idMovimientoMaterial),
      fecha: this.formCabecera.controls.fecha.value?.toISOString() ?? new Date().toISOString(),
      tipomovimiento: this.formCabecera.controls.tipoMovimiento.value ?? '-',
      idusuarioentrega: this.formCabecera.controls.idUsuarioEntrega.value ?? -1,
      idusuarioresponsable: this.sesionSrv.idusuario,
      observacion: this.formCabecera.controls.observacion.value ?? undefined,
      detalles: this.tablaDetallesMovimientosComp.lstDetallesMovimientos,
      devuelto: false,
      eliminado: false,
      idmovimientoreferencia: this.idMovimientoReferencia != null ? Number(this.idMovimientoReferencia) : undefined
    }
  }

  imprimir(){
    this.impresionSrv.imprimirReporteMovimientosMateriales(this.iframe, Number(this.idMovimientoMaterial), this.viewContainerRef)
    .subscribe(loading => this.loadingImpresion = loading);
  }

  limpiar(){
    this.idMovimientoMaterial = 'nuevo';
    this.router.navigate(['nuevo'], {relativeTo: this.aroute.parent});
    this.formCabecera.controls.idUsuarioEntrega.reset();
    this.formCabecera.controls.observacion.reset();
    this.formCabecera.controls.tipoMovimiento.reset();
    this.tablaDetallesMovimientosComp.lstDetallesMovimientos = [];
    this.idMovimientoReferencia = null;
  }

  opcionSAHabilitada(): boolean{
    if(this.idMovimientoReferencia != null) return false;
    if(this.idMovimientoMaterial != 'nuevo' && this.formCabecera.controls.tipoMovimiento.value != 'SA') return false;
    return true;
  }

  opcionENHabilitada(): boolean{
    if(this.idMovimientoReferencia != null) return false;
    if(this.idMovimientoMaterial != 'nuevo' && this.formCabecera.controls.tipoMovimiento.value != 'EN') return false;
    return true;
  }

  opcionAJHabilitada(): boolean{
    if(this.idMovimientoReferencia != null) return false;
    if(this.idMovimientoMaterial != 'nuevo' && this.formCabecera.controls.tipoMovimiento.value != 'AJ') return false;
    return true;
  }
}
