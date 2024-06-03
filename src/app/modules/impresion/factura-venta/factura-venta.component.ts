import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Cliente } from '@dto/cliente-dto';
import { Venta } from '@dto/venta.dto';
import { ClientesService } from '@services/clientes.service';
import { VentasService } from '@services/ventas.service';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { NumberToWords } from '@util/number-to-words';

@Component({
  selector: 'app-factura-venta',
  templateUrl: './factura-venta.component.html',
  styleUrls: ['./factura-venta.component.scss']
})
export class FacturaVentaComponent implements OnInit {

  @Output()
  dataLoaded: EventEmitter<boolean> = new EventEmitter();
  factura: Venta = new Venta();

  cliente: Cliente | null = null;

  constructor(
    private ventasSrv: VentasService,
    private clientesSrv: ClientesService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
  }

  cargarFactura(id: number) {
    this.ventasSrv.getPorId(id).subscribe({
      next: (fact) => {
        this.factura = fact;
        if (this.factura.idcliente) this.clientesSrv.getPorId(this.factura.idcliente).subscribe({
          next: (cli) => {
            this.cliente = cli;
            this.dataLoaded.emit(true);
          },
          error: (er) => {
            console.log('Error al cargar cliente de la factura');
            console.log(er);
            this.httpErrorHandler.handle(er);
          }
        });
      },
      error: (e) => {
        console.log('Error al cargar factura para impresion');
        console.log(e);
        this.httpErrorHandler.handle(e);
      }
    });
    /*try {
      this.factura = await this.ventasSrv.getPorId(id).toPromise();
      if (this.factura.idcliente) this.cliente = await this.clientesSrv.getPorId(this.factura.idcliente).toPromise();
      this.dataLoaded.emit(true);
    } catch (e) {
      console.log('Error al cargar factura para impresion');
      console.log(e);
      this.httpErrorHandler.handle(e);
    }*/
  }

  nroFacturaPadded(nro: number | null): string {
    if (nro) return nro.toString().padStart(7, '0');
    return '';
  }

  numeroALetras(num: number): string {
    return NumberToWords.convert(num);
  }

}
