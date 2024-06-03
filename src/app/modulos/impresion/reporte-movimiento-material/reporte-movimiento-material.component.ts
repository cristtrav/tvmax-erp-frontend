import { Component, Inject, LOCALE_ID, ViewEncapsulation } from '@angular/core';
import { DetalleMovimientoMaterialDTO } from '@dto/detalle-movimiento-material.dto';
import { MovimientoMaterialDTO } from '@dto/movimiento-material.dto';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { IFiltroReporte } from '@util/interfaces/ifiltros-reporte.interface';
import { Observable, catchError, forkJoin, tap } from 'rxjs';
import { formatDate } from '@angular/common';
import { MovimientosMaterialesService } from '@global-services/depositos/movimientos-materiales.service';

@Component({
  selector: 'app-reporte-movimiento-material',
  templateUrl: './reporte-movimiento-material.component.html',
  styleUrls: ['./reporte-movimiento-material.component.scss', './../estilos-tabla-reportes.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class ReporteMovimientoMaterialComponent {

  movimiento: MovimientoMaterialDTO | null = null;
  detallesMovimientos: DetalleMovimientoMaterialDTO[] = [];
  lstFiltrosReporte: IFiltroReporte[] = [];

  constructor(
    @Inject(LOCALE_ID)
    private locale: string,
    private movimientosMaterialesSrv: MovimientosMaterialesService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ){}

  cargarDatos(idmovimiento: number): Observable<any>{
    const consultas = {
      movimiento: this.movimientosMaterialesSrv.getPorId(idmovimiento),
      detalles: this.movimientosMaterialesSrv.getDetallesPorIdMovimiento(idmovimiento)
    }
    return forkJoin(consultas)
      .pipe(
        tap(resp => {
          this.movimiento = resp.movimiento;
          this.detallesMovimientos = resp.detalles;
          this.cargarCabecera(resp.movimiento);
        }),
        catchError(e => {
          console.error('Error al cargar datos de impresion de movimiento de material', e);
          this.httpErrorHandler.process(e);
          return e;
        })
      )
  }

  cargarCabecera(movimiento: MovimientoMaterialDTO){
    this.lstFiltrosReporte.push(
      { titulo: 'Tipo de movimiento', contenido: this.getDescripcionTipoMovimiento(movimiento.tipomovimiento)},
      { titulo: 'Fecha', contenido: formatDate(movimiento.fecha, 'dd/MM/yyyy', this.locale)},
      { titulo: 'Encargado de depósito', contenido: movimiento.usuarioresponsable },
      { titulo: this.getTituloUsuarioEntrega(movimiento.tipomovimiento), contenido: movimiento.usuarioentrega ?? '(ninguno)' },
      { titulo: 'Observación', contenido: movimiento.observacion ?? '(ninguna)'},
      
    );
  }

  private getDescripcionTipoMovimiento(tipo: string): string{
    if(tipo == 'EN') return 'ENTRADA';
    if(tipo == 'SA') return 'SALIDA';
    if(tipo == 'AJ') return 'AJUSTE';
    if(tipo == 'DE') return 'DEVOLUCIÓN'
    return '(Sin especificar)';
  }

  private getTituloUsuarioEntrega(tipomovimiento: string): string {
    if(tipomovimiento == 'EN') return 'Entregado por';
    if(tipomovimiento == 'SA') return 'Entregado a';
    if(tipomovimiento == 'DE') return 'Entregado por';
    return 'Responsable';
  }

}
