import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DetalleMovimientoMaterialDTO } from '@dto/detalle-movimiento-material.dto';
import { MaterialDTO } from '@dto/material.dto';
import { NzInputNumberComponent } from 'ng-zorro-antd/input-number';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-tabla-detalles-movimientos',
  templateUrl: './tabla-detalles-movimientos.component.html',
  styleUrls: ['./tabla-detalles-movimientos.component.scss']
})
export class TablaDetallesMovimientosComponent {

  @Input()
  tipoMovimiento: string | null = null;

  @Input()
  lstDetallesMovimientos: DetalleMovimientoMaterialDTO[] = [];

  @Output()
  lstDetallesMovimientosChange = new EventEmitter<DetalleMovimientoMaterialDTO[]>()

  idDetalleEnEdicion: number | null = 0;
  cantidadEnEdicion: number = 1;

  constructor(
    private modal: NzModalService,
    private notif: NzNotificationService
  ){}

  agregarDetalleMovimiento(material: MaterialDTO){
    const detalleMovimiento: DetalleMovimientoMaterialDTO = {
      id: Number(`${this.lstDetallesMovimientos.length}${material.id}`),
      idmaterial: material.id,
      material: material.descripcion,
      descripcion: material.descripcion.toUpperCase(),
      cantidad: 1.0,
      unidadmedida: material.unidadmedida,
      eliminado: false
    };
    this.lstDetallesMovimientos = this.lstDetallesMovimientos.concat([detalleMovimiento]);
  }

  iniciarEdicion(detalleMovimiento: DetalleMovimientoMaterialDTO | undefined, inputComp: NzInputNumberComponent){
    if(detalleMovimiento == null || detalleMovimiento.id == null) return;
    
    this.idDetalleEnEdicion = detalleMovimiento.id;
    this.cantidadEnEdicion = detalleMovimiento.cantidad;
    setTimeout(() => {
      inputComp.focus();
    }, 200);
  }

  finalizarEdicion(){
    this.lstDetallesMovimientos = this.lstDetallesMovimientos.map(detalle => {
      if(detalle.id == this.idDetalleEnEdicion) detalle.cantidad = this.cantidadEnEdicion;
      return detalle;
    });
    this.idDetalleEnEdicion = null;
    this.lstDetallesMovimientosChange.emit(this.lstDetallesMovimientos);
  }

  confirmarEliminacion(detalleMovimiento: DetalleMovimientoMaterialDTO){
    this.modal.confirm({
      nzTitle: '¿Desea eliminar el material?',
      nzContent: `${detalleMovimiento.material} (${detalleMovimiento.cantidad} ${detalleMovimiento.unidadmedida == 'MT' ? 'mts.' : 'uds.'})`,
      nzOkText: 'Eliminar',
      nzOkDanger: true,
      nzOnOk: () => {
        this.eliminarDetalle(detalleMovimiento.id ?? -1)
      }
    })
  }

  eliminarDetalle(idDetalleMovimiento: number){
    this.lstDetallesMovimientos = this.lstDetallesMovimientos.filter(detalle => detalle.id != idDetalleMovimiento);
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
    return true;
  }

}
