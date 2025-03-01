import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Cliente } from '@dto/cliente-dto';
import { DetalleVenta } from '@dto/detalle-venta-dto';
import { FormatoFacturaDTO } from '@dto/formato-factura.dto';
import { Venta } from '@dto/venta.dto';
import { ClientesService } from '@services/clientes.service';
import { TalonariosService } from '@services/facturacion/talonarios.service';
import { VentasService } from '@services/ventas.service';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
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
  @Input()
  ocultarEnPantalla: boolean = true;

  dataLoaded = new EventEmitter<boolean>();

  constructor(
    private ventasSrv: VentasService,
    private clientesSrv: ClientesService,
    private talonariosSrv: TalonariosService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
  }

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
        formatoFactura: resp.venta.idtalonario ? this.talonariosSrv.getFormatoPorTalonario(resp.venta.idtalonario) : EMPTY,
        cliente: resp.venta.idcliente ? this.clientesSrv.getPorId(resp.venta.idcliente) : EMPTY
      })),
      tap(resp => {
        this.venta = resp.venta;
        this.detalles = resp.detalles;
        if(resp.cliente?.direccion) this.direccionCliente = resp.cliente.direccion;
        if(resp.formatoFactura) this.parametros = resp.formatoFactura.parametros;
        this.telefonoCliente = resp.cliente?.telefono1 ?? resp.cliente?.telefono2;        

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
