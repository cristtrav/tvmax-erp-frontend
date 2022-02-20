import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Cliente } from '@dto/cliente-dto';
import { FacturaVenta } from '@dto/factura-venta.dto';
import { ClientesService } from '@servicios/clientes.service';
import { VentasService } from '@servicios/ventas.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { NumberToWords } from '@util/number-to-words';

@Component({
  selector: 'app-factura-venta',
  templateUrl: './factura-venta.component.html',
  styleUrls: ['./factura-venta.component.scss']
})
export class FacturaVentaComponent implements OnInit {

  @Output()
  dataLoaded: EventEmitter<boolean> = new EventEmitter();
  factura: FacturaVenta = new FacturaVenta();
  
  cliente: Cliente | null = null;
  
  constructor(
    private ventasSrv: VentasService,
    private clientesSrv: ClientesService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
  }

  async cargarFactura(id: number){
    try{
      this.factura = await this.ventasSrv.getPorId(id).toPromise();
      if(this.factura.idcliente) this.cliente = await this.clientesSrv.getPorId(this.factura.idcliente).toPromise();
      this.dataLoaded.emit(true);
    }catch(e){
      console.log('Error al cargar factura para impresion');
      console.log(e);
      this.httpErrorHandler.handle(e);
    }
  }

  nroFacturaPadded(nro: number | null): string{
    if(nro) return nro.toString().padStart(7, '0');
    return '';
  }

  numeroALetras(num: number): string{
    return NumberToWords.convert(num);
  }

}
