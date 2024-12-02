import { Component, EventEmitter, Inject, Input, LOCALE_ID, Output } from '@angular/core';
import { DetalleVenta } from '@dto/detalle-venta-dto';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-paso-items',
  templateUrl: './paso-items.component.html',
  styleUrls: ['./paso-items.component.scss']
})
export class PasoItemsComponent {

  @Input()
  totalVenta: number = 0;

  @Input()
  lstDetalles: DetalleVenta[] = [];

  @Output()
  quitarIndice = new EventEmitter<number>()

  constructor(
    @Inject(LOCALE_ID)
    private locale: string,
    private modal: NzModalService
  ){}

  confirmarEliminacion(detalle: DetalleVenta, index: number){
    this.modal.confirm({
      nzTitle: `¿Desa quitar ${detalle.idcuota != null ? 'la cuota': 'el servicio'}?`,
      nzContent: `${detalle.descripcion} - Gs. ${new DecimalPipe(this.locale).transform(detalle.monto) }?`,
      nzOkDanger: true,
      nzOkText: 'Quitar',
      nzOnOk: () => this.quitarIndice.emit(index)
    })
  }

}
