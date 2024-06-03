import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DetalleMovimientoMaterialDTO } from '@dto/detalle-movimiento-material.dto';
import { MaterialIdentificableDTO } from '@dto/material-identificable.dto';
import { MaterialDTO } from '@dto/material.dto';
import { MaterialesService } from '@global-services/depositos/materiales.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { NzStatus } from 'ng-zorro-antd/core/types';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-tabla-detalles-movimientos',
  templateUrl: './tabla-detalles-movimientos.component.html',
  styleUrls: ['./tabla-detalles-movimientos.component.scss']
})
export class TablaDetallesMovimientosComponent {

  @Input()
  set tipoMovimiento(tipo: string | null){
    if(tipo != this._tipoMovimiento && this.idDetalleEnEdicion) this.limpiarNrosDeSerieDetalle();
    this._tipoMovimiento = tipo;
  }

  get tipoMovimiento(): string | null {
    return this._tipoMovimiento;
  }
  private _tipoMovimiento: string | null = null;

  @Input()
  set lstDetallesMovimientos(detalles: DetalleMovimientoMaterialDTO[]){
    this.mapLoadingIdentificables.clear();
    this.mapMaterialIdentificable.clear();
    this.mapStatusSelectSerial.clear();
    this._lstDetallesMovimientos = detalles;
  }

  get lstDetallesMovimientos(): DetalleMovimientoMaterialDTO[]{
    return this._lstDetallesMovimientos;
  }
  private _lstDetallesMovimientos: DetalleMovimientoMaterialDTO[] = [];

  @Output()
  lstDetallesMovimientosChange = new EventEmitter<DetalleMovimientoMaterialDTO[]>()

  idDetalleEnEdicion: number | null = null;
  cantidadEnEdicion: number = 1;

  idDetalleSerialEdicion: number | null = null;
  nroSerieEnEdicion: string | undefined;

  lstMaterialIdentificableActual: MaterialIdentificableDTO[] = [];
  isOpenMenuMaterial: boolean = false;

  mapMaterialIdentificable = new Map<number, MaterialIdentificableDTO[]>();
  mapLoadingIdentificables = new Map<number, boolean>();
  mapStatusSelectSerial = new Map<number, NzStatus>();

  constructor(
    private modal: NzModalService,
    private notif: NzNotificationService,
    private materialesSrv: MaterialesService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ){}

  agregarDetalleMovimiento(material: MaterialDTO){
    const detalleMovimiento: DetalleMovimientoMaterialDTO = {
      id: this.lstDetallesMovimientos.length,
      idmaterial: material.id,
      material: material.descripcion,
      descripcion: material.descripcion.toUpperCase(),
      cantidad: 1.0,
      unidadmedida: material.unidadmedida,
      materialidentificable: material.identificable,
      eliminado: false
    };
    this.mapLoadingIdentificables.set(detalleMovimiento.id ?? -1, false);
    this.cargarMaterialesIdentificables(detalleMovimiento, true)
    this.lstDetallesMovimientos = this.lstDetallesMovimientos.concat([detalleMovimiento]);
    this.mapStatusSelectSerial.set(detalleMovimiento.id ?? -1, '');
  }

  cargarTodosMaterialesIdentificables(disponible?: boolean){
    this.lstDetallesMovimientos.forEach(d => this.cargarMaterialesIdentificables(d, disponible));
  }

  private cargarMaterialesIdentificables(detalle: DetalleMovimientoMaterialDTO, disponible?: boolean){
    let params = new HttpParams();
    if(disponible != null) params = params.append('disponible', disponible);
    this.mapLoadingIdentificables.set(detalle.id ?? -1, true);
    this.materialesSrv.getMaterialIdentificableByMaterial(detalle.idmaterial, params)
    .pipe(finalize(() => this.mapLoadingIdentificables.set(detalle.id ?? -1, false)))
    .subscribe({
      next: (identificables) => {
        this.mapMaterialIdentificable.set(detalle.id ?? -1, identificables)
      },
      error: (e) => {
        this.mapMaterialIdentificable.set(detalle.id ?? -1, []);
        console.error('Error al cargar materiales identificables', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

  confirmarEliminacion(detalleMovimiento: DetalleMovimientoMaterialDTO){
    this.modal.confirm({
      nzTitle: '¿Desea eliminar el material?',
      nzContent: `${detalleMovimiento.material} (${detalleMovimiento.cantidad} ${detalleMovimiento.unidadmedida == 'MT' ? 'mts.' : 'uds.'})`,
      nzOkText: 'Eliminar',
      nzOkDanger: true,
      nzOnOk: () => {
        this.eliminarDetalle(detalleMovimiento.id ?? -1);
      }
    })
  }

  eliminarDetalle(idDetalleMovimiento: number){
    this.lstDetallesMovimientos = this.lstDetallesMovimientos.filter(detalle => detalle.id != idDetalleMovimiento);
    this.mapLoadingIdentificables.delete(idDetalleMovimiento);
    this.mapMaterialIdentificable.delete(idDetalleMovimiento);
    this.mapStatusSelectSerial.delete(idDetalleMovimiento);
    this.existenSerialesDuplicados();
    this.lstDetallesMovimientosChange.emit(this.lstDetallesMovimientos);
  }

  isDetallesMovimientosValid(): boolean{
    if(this.lstDetallesMovimientos.length === 0){
      this.notif.create('error', '<strong>Error de validación</strong>', 'Agregue por lo menos un material.')
      return false;
    }
    const detalleConCero = this.lstDetallesMovimientos.find(d => d.cantidad == 0);
    if(detalleConCero && this.tipoMovimiento != 'AJ' && this.tipoMovimiento != 'DE'){
      this.notif.create('error', '<strong>Error de validación</strong>', 'Las cantidades 0 (cero) solo se admiten en el tipo «Ajuste».');
      return false;
    }
    return !this.existenSerialesDuplicados();
  }

  existenSerialesDuplicados(): boolean {
    this.mapStatusSelectSerial.forEach((value, key, map) => map.set(key, ''));
    let existDuplicates = false;
    const lstDetallesIdentificables = this.lstDetallesMovimientos.filter(d => d.materialidentificable && d.nroseriematerial != null);
    for(let detIdent of lstDetallesIdentificables){
      const index = lstDetallesIdentificables
        .filter(d => d.id != detIdent.id)
        .findIndex(d => d.nroseriematerial == detIdent.nroseriematerial && d.idmaterial == detIdent.idmaterial);
      if(index != -1){
        this.mapStatusSelectSerial.set(detIdent.id ?? -1, 'error');
        existDuplicates = true;
      };
    }
    if(existDuplicates) this.notif.error('<strong>Duplicados</strong>', 'Existen números de serie duplicados.')
    return existDuplicates;
  }

  onSerialSeleccionado(serial: string | null){
    this.lstDetallesMovimientosChange.emit(this.lstDetallesMovimientos);
  }

  onChangeSelectSerial(detalle: DetalleMovimientoMaterialDTO){
    this.existenSerialesDuplicados();
    this.lstDetallesMovimientosChange.emit(this.lstDetallesMovimientos);
  }

  onDetalleMovimientosChange(){
    this.lstDetallesMovimientosChange.emit(this.lstDetallesMovimientos);
  }

  limpiarNrosDeSerieDetalle(){
    this.lstDetallesMovimientos.forEach(d => d.nroseriematerial = undefined)
  }

  recargarNrosDeSerie(){
    this.lstDetallesMovimientos.forEach(d => this.cargarMaterialesIdentificables(d, true));
  }

  disabledInputCantidad(detalle: DetalleMovimientoMaterialDTO): boolean {
    if(detalle.materialidentificable && this.tipoMovimiento == 'DE') return false;
    else return detalle.materialidentificable ?? false;
  }

  minInputCantidad(detalle: DetalleMovimientoMaterialDTO): number {
    if(this.tipoMovimiento == 'AJ' || this.tipoMovimiento == 'DE') return 0;
    if(detalle.unidadmedida == 'MT') return 0.01;
    return 1;
  }
  
  maxInputCantidad(detalle: DetalleMovimientoMaterialDTO): number {
    if(detalle.cantidadretirada != null) return detalle.cantidadretirada;
    return 999999;
  }

  stepInputCantidad(detalle: DetalleMovimientoMaterialDTO): number {
    if(detalle.unidadmedida == 'MT') return 0.01;
    return 1;
  }

  limpiar(){
    this.lstDetallesMovimientos = [];
    this.mapLoadingIdentificables.clear();
    this.mapMaterialIdentificable.clear();
    this.mapStatusSelectSerial.clear();
  }

  generarSerial(detalleMovimiento: DetalleMovimientoMaterialDTO){
    this.materialesSrv.getLastGeneratedSerial(detalleMovimiento.idmaterial)
    .subscribe({
      next: (serial) => {
        detalleMovimiento.nroseriematerial = this.generarSiguienteSerial(detalleMovimiento, serial);
      },
      error: (e) => {
        console.error('Error al cargar nro de serie material', e);
        this.httpErrorHandler.process(e);
      }
    });
  }

  private generarSiguienteSerial(detalle: DetalleMovimientoMaterialDTO, serialPrevio: string): string{
    let nroSeriePrevio: number = 0;
    if(serialPrevio) nroSeriePrevio = Number(serialPrevio.substring(8));
    const detallesSerialGenerado =
      this.lstDetallesMovimientos.filter(dm =>
        dm.nroseriematerial?.substring(0,4) == 'TVMX' &&
        dm.idmaterial == detalle.idmaterial &&
        dm.id != detalle.id
      );
    for(let detalle of detallesSerialGenerado){
      const nro = Number(detalle.nroseriematerial?.substring(8));
      if(Number.isInteger(nro) && nro > nroSeriePrevio) nroSeriePrevio = nro;
    }
    return `TVMX${detalle.idmaterial.toString().padStart(4, '0')}${(nroSeriePrevio + 1).toString().padStart(6, '0')}`;
  }
}
