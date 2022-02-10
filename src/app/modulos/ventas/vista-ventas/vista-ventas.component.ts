import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Cobrador } from '@dto/cobrador-dto';
import { FacturaVenta } from '@dto/factura-venta.dto';
import { ServerResponseList } from '@dto/server-response-list.dto';
import { Usuario } from '@dto/usuario-dto';
import { CobradoresService } from '@servicios/cobradores.service';
import { UsuariosService } from '@servicios/usuarios.service';
import { VentasService } from '@servicios/ventas.service';
import { Extra } from '@util/extra';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-vista-ventas',
  templateUrl: './vista-ventas.component.html',
  styleUrls: ['./vista-ventas.component.scss']
})
export class VistaVentasComponent implements OnInit {

  sortStr: string | null = '+id';
  pageIndex: number = 1;
  pageSize: number = 10;
  totalRegisters: number = 0;

  lstFacturasVenta: FacturaVenta[] = [];

  loadingVentas: boolean = false;

  textoBusqueda: string = '';
  timerBusqueda: any;
  cantFiltrosAplicados: number = 0;
  cantFiltrosFacturas: number = 0;
  cantFiltrosCobros: number = 0;
  drawerFiltrosVisible: boolean = false; 
  
  fechaInicioFiltro: Date | null = null;
  fechaFinFiltro: Date | null = null;

  fechaInicioCobroFiltro: Date | null = null;
  fechaFinCobroFiltro: Date | null = null;

  filtroPagado: boolean = false;
  filtroPendiente: boolean = false;
  filtroAnulado: boolean = false;
  filtroNoAnulado: boolean = false;

  lstCobradoresFiltro: Cobrador[] = [];
  idCobradorFiltro: number | null = null;

  lstUsuariosFiltro: Usuario[] = [];
  idUsuarioCobroFiltro: number | null = null;

  expandSet = new Set<number>();

  constructor(
    private ventasSrv: VentasService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private notif: NzNotificationService,
    private cobradoresSrv: CobradoresService,
    private usuariosSrv: UsuariosService
  ) { }

  ngOnInit(): void {
    this.cargarVentas();
    this.cargarCobradoresFiltro();
    this.cargarUsuarioFiltro();
  }

  cargarUsuarioFiltro(){
    let params: HttpParams = new HttpParams();
    params = params.append('eliminado', 'false');
    params = params.append('sort', '+nombres');
    this.usuariosSrv.get(params).subscribe((resp: ServerResponseList<Usuario>)=>{
      this.lstUsuariosFiltro = resp.data;
    }, (e)=>{
      console.log('Error al cargar usuarios del filtro');
      console.log(e);
      this.httpErrorHandler.handle(e);
    });
  }

  cargarCobradoresFiltro(){
    let params: HttpParams = new HttpParams();
    params = params.append('eliminado', 'false');
    params = params.append('sort', '+razon_social');
    this.cobradoresSrv.get(params).subscribe((resp: ServerResponseList<Cobrador>)=>{
      this.lstCobradoresFiltro = resp.data;
    }, (e)=>{
      console.log('Error al cargar cobradores filtro');
      console.log(e);
      this.httpErrorHandler.handle(e);
    });
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.fechaFinFiltro) {
      return false;
    }
    const ffd: Date = new Date(this.fechaFinFiltro.getFullYear(), this.fechaFinFiltro.getMonth(), this.fechaFinFiltro.getDate() + 1);
    return startValue.getTime() > ffd.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.fechaInicioFiltro) {
      return false;
    }
    const fid: Date = new Date(this.fechaInicioFiltro.getFullYear(), this.fechaInicioFiltro.getMonth(), this.fechaInicioFiltro.getDate()-1);
    return endValue.getTime() <= fid.getTime();
  };

  disabledStartDateCobro = (startValue: Date): boolean => {
    if (!startValue || !this.fechaFinCobroFiltro) {
      return false;
    }
    const ffd: Date = new Date(this.fechaFinCobroFiltro.getFullYear(), this.fechaFinCobroFiltro.getMonth(), this.fechaFinCobroFiltro.getDate() + 1);
    return startValue.getTime() > ffd.getTime();
  };

  disabledEndDateCobro = (endValue: Date): boolean => {
    if (!endValue || !this.fechaInicioCobroFiltro) {
      return false;
    }
    const fid: Date = new Date(this.fechaInicioCobroFiltro.getFullYear(), this.fechaInicioCobroFiltro.getMonth(), this.fechaInicioCobroFiltro.getDate()-1);
    return endValue.getTime() <= fid.getTime();
  };

  cargarVentas(){
    this.loadingVentas = true;
    this.ventasSrv.get(this.getHttpParams()).subscribe((resp: ServerResponseList<FacturaVenta>)=>{
      this.totalRegisters = resp.queryRowCount;
      this.lstFacturasVenta = resp.data;
      this.loadingVentas = false;
    }, (e)=>{
      console.log('Error al consultar ventas');
      console.log(e);
      this.httpErrorHandler.handle(e);
      this.loadingVentas = false;
    });
  }

  getHttpParams(): HttpParams{
    let params: HttpParams = new HttpParams();
    params = params.append('eliminado', 'false');
    if(this.sortStr) params = params.append('sort', this.sortStr);
    params = params.append('offset', `${(this.pageIndex-1)*this.pageSize}`);
    params = params.append('limit', `${this.pageSize}`);
    if(this.textoBusqueda) params = params.append('search', this.textoBusqueda);
    if(this.fechaInicioFiltro){
      const fechaInicioStr = `${this.fechaInicioFiltro.getFullYear()}-${(this.fechaInicioFiltro.getMonth() + 1).toString().padStart(2, '0')}-${this.fechaInicioFiltro.getDate().toString().padStart(2, '0')}`;
      params = params.append('fechainiciofactura', fechaInicioStr);
    }
    if(this.fechaFinFiltro){
      const fechaFinStr = `${this.fechaFinFiltro.getFullYear()}-${(this.fechaFinFiltro.getMonth() + 1).toString().padStart(2, '0')}-${this.fechaFinFiltro.getDate().toString().padStart(2, '0')}`;
      params = params.append('fechafinfactura', fechaFinStr);
    }
    if(this.filtroAnulado != this.filtroNoAnulado) params = params.append('anulado', `${this.filtroAnulado}`);
    if(this.filtroPagado != this.filtroPendiente) params = params.append('pagado', `${this.filtroPagado}`);
    if(this.idCobradorFiltro) params = params.append('idcobradorcomision', `${this.idCobradorFiltro}`);
    if(this.idUsuarioCobroFiltro) params = params.append('idusuarioregistrocobro', `${this.idUsuarioCobroFiltro}`);
    if(this.fechaInicioCobroFiltro){
      const fechaIniCobroStr: string = `${this.fechaInicioCobroFiltro.getFullYear()}-${(this.fechaInicioCobroFiltro.getMonth()+1).toString().padStart(2,'0')}-${this.fechaInicioCobroFiltro.getDate().toString().padStart(2, '0')}`;
      params = params.append('fechainiciocobro', fechaIniCobroStr);
    }
    if(this.fechaFinCobroFiltro){
      const fechaFinCobroStr: string = `${this.fechaFinCobroFiltro.getFullYear()}-${(this.fechaFinCobroFiltro.getMonth()+1).toString().padStart(2,'0')}-${this.fechaFinCobroFiltro.getDate().toString().padStart(2, '0')}`;
      params = params.append('fechafincobro', fechaFinCobroStr);
    }
    return params;
  }

  onTableQueryParamsChange(tParams: NzTableQueryParams){
    this.pageIndex = tParams.pageIndex;
    this.pageSize = tParams.pageSize;
    this.sortStr = Extra.buildSortString(tParams.sort);
    this.cargarVentas();
  }

  procesarAnulacion(fv: FacturaVenta | null){
    if(fv){
      if(fv.anulado){
        this.revertirAnulacion(fv.id);
      }else{
        this.anularFactura(fv.id);
      }
    }
  }

  private anularFactura(id: number | null): void{
    if(id){
      this.ventasSrv.anular(id).subscribe(()=>{
        for(let fv of this.lstFacturasVenta){
          if(fv.id === id){
            fv.anulado = true;
            break;
          }
        }
        this.notif.create('success', '<b>Éxito<b>', 'Factura anulada correctamente');
      }, (e)=>{
        console.log('Error al anular factura');
        console.log(e);
        this.httpErrorHandler.handle(e, 'anular factura');
      });
    }
  }

  private revertirAnulacion(id: number | null): void{
    if(id){
      this.ventasSrv.revertiranul(id).subscribe(()=>{
        /*for(let fv of this.lstFacturasVenta){
          if(fv.id === id){
            fv.anulado = false;
            break;
          }
        }*/
        this.cargarVentas();
        this.notif.create('success','<b>Éxito</b>', 'Anulación revertida correctamente');
      }, (e)=>{
        console.log('Error al revertir anulacion de factura');
        console.log(e);
        this.httpErrorHandler.handle(e, 'revertir anulación');
      });
    }
  }

  eliminarVenta(id: number | null): void{
    if(id){
      this.ventasSrv.delete(id).subscribe(()=>{
        this.notif.create('success', '<b>Éxito</b>', 'Factura eliminada correctamente');
        this.cargarVentas();
      }, (e)=>{
        console.log('Error al eliminar venta');
        console.log(e);
        this.httpErrorHandler.handle(e);
      });
    }
  }

  filtrar(){
    this.cargarVentas();
    this.calcularCantidadFiltros();
  }

  buscar(){
    clearTimeout(this.timerBusqueda);
    this.timerBusqueda = setTimeout(()=>{
      this.cargarVentas();
    }, 500);
  }

  limpiarFiltroFechas(){
    this.fechaInicioFiltro = null;
    this.fechaFinFiltro = null;
    this.filtrar();
  }

  calcularCantidadFiltros(){
    let cantFactura: number = 0;
    let cantCobro: number = 0;
    if(this.fechaInicioFiltro) cantFactura++;
    if(this.fechaFinFiltro) cantFactura++;
    if(this.filtroPagado) cantFactura++;
    if(this.filtroPendiente) cantFactura++;
    if(this.filtroAnulado) cantFactura++;
    if(this.filtroNoAnulado) cantFactura++;

    if(this.idCobradorFiltro) cantCobro++;
    if(this.idUsuarioCobroFiltro) cantCobro++;
    if(this.fechaInicioCobroFiltro) cantCobro++;
    if(this.fechaFinCobroFiltro) cantCobro++;

    this.cantFiltrosFacturas = cantFactura;
    this.cantFiltrosCobros = cantCobro;
    this.cantFiltrosAplicados = cantFactura + cantCobro;
  }

  limpiarFiltroPagos(){
    this.filtroPendiente = false;
    this.filtroPagado = false;
    this.filtrar();
  }

  limpiarFiltrosAnulacion(){
    this.filtroAnulado = false;
    this.filtroNoAnulado = false;
    this.filtrar();
  }

  limpiarFiltroCobrador(){
    this.idCobradorFiltro = null;
    this.filtrar();
  }

  limpiarFiltroUsuarioCobro(){
    this.idUsuarioCobroFiltro = null;
    this.filtrar();
  }

  limpiarFiltrosFechasCobro(){
    this.fechaInicioCobroFiltro = null;
    this.fechaFinCobroFiltro = null;
    this.filtrar();
  }

}
