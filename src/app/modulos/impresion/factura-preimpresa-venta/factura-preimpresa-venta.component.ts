import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Cliente } from '@dto/cliente-dto';
import { DetalleVenta } from '@dto/detalle-venta-dto';
import { FormatoFacturaDTO } from '@dto/formato-factura.dto';
import { Venta } from '@dto/venta.dto';
import { ClientesService } from '@servicios/clientes.service';
import { FormatosFacturasService } from '@servicios/formatos-facturas.service';
import { TimbradosService } from '@servicios/timbrados.service';
import { VentasService } from '@servicios/ventas.service';
import { Extra } from '@util/extra';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { catchError, EMPTY, forkJoin, Observable, of, switchMap, tap } from 'rxjs';
import { FormatoFacturaA } from './formato-factura-a';

@Component({
  selector: 'app-factura-preimpresa-venta',
  templateUrl: './factura-preimpresa-venta.component.html',
  styleUrls: ['./factura-preimpresa-venta.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class FacturaPreimpresaVentaComponent implements OnInit {
  
  @Input()
  parametros: FormatoFacturaA = new FormatoFacturaA();
  @Input()
  venta: Venta = new Venta();
  @Input()
  detalles: DetalleVenta[] = [];
  @Input()
  direccionCliente: string | null = null;
  @Input()
  telefonoCliente: string | null = null;

  dataLoaded = new EventEmitter<boolean>();

  constructor(
    private ventasSrv: VentasService,
    private clientesSrv: ClientesService,
    private timbradosSrv: TimbradosService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
  }

  /*cargarFactura(idventa: number) {
    const detallesParams = new HttpParams().append('eliminado', 'false');
    forkJoin({
      venta: this.ventasSrv.getPorId(idventa),
      detalles: this.ventasSrv.getDetallePorIdVenta(idventa, detallesParams)
    }).subscribe({
      next: (resp) => {
        this.venta = resp.venta;
        this.detalles = resp.detalles;
        console.log('venta cargada');
        if(resp.venta.idtimbrado) this.cargarParametrosImpresion(resp.venta.idtimbrado)
        if(resp.venta.idcliente) this.cargarDireccion(resp.venta.idcliente);
        else this.dataLoaded.emit(true);
      },
      error: (e) => {
        console.error('Error al cargar factura venta', e);
        this.httpErrorHandler.process(e);
      }
    });
  }*/

  /*cargarParametrosImpresion(idtimbrado: number){
    this.timbradosSrv.getFormatoPorTimbrado(idtimbrado).subscribe({
      next: (formato) => {
        console.log(formato);
        this.parametros = <FormatoFacturaA>(<unknown>formato);
      },
      error: (e) => {
        console.error('Error al cargar formato de factura por id', e);
        this.httpErrorHandler.process(e);
      }
    })
  }*/

  /*private cargarDireccion(idcliente: number){
    this.clienteSrv.getPorId(idcliente).subscribe({
      next: (cliente) => {
        this.direccionCliente = cliente.direccion;
        this.telefonoCliente = cliente.telefono1
        this.dataLoaded.emit(true);
      },
      error: (e) => {
        console.error('Error al cargar cliente por id', e);
        this.httpErrorHandler.process(e);
      }
    })
  }*/

  cargarDatos(idventa: number): Observable<{
    venta: Venta,
    detalles: DetalleVenta[],
    formatoFactura: FormatoFacturaDTO | null,
    cliente: Cliente | null
  }> {
    const detallesParams = new HttpParams().append('eliminado', 'false');

    return forkJoin({
      venta: this.ventasSrv.getPorId(idventa),
      detalles: this.ventasSrv.getDetallePorIdVenta(idventa, detallesParams)
    }).pipe(
      switchMap(resp => forkJoin({
        venta: of(resp.venta),
        detalles: of(resp.detalles),
        formatoFactura: resp.venta.idtimbrado ? this.timbradosSrv.getFormatoPorTimbrado(resp.venta.idtimbrado) : EMPTY,
        cliente: resp.venta.idcliente ? this.clientesSrv.getPorId(resp.venta.idcliente) : EMPTY
      })),
      tap(resp => {
        this.venta = resp.venta;
        this.detalles = resp.detalles;
        if(resp.cliente?.direccion) this.direccionCliente = resp.cliente.direccion;
        if(resp.formatoFactura) this.parametros = resp.formatoFactura.parametros;
        
        this.parametros.mostrarBordes = false;
        this.parametros.mostrarGrilla = false;
        this.parametros.mostrarEtiquetas = false;
      }),
      catchError(e => {
        console.error('Error imprimir factura', e);
        this.httpErrorHandler.process(e);
        return of(e);
      })
    );
  }

}
