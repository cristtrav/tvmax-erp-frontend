import { formatDate } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Inject, Input, LOCALE_ID, OnInit, Output } from '@angular/core';
import { Venta } from '@dto/venta.dto';
import { Funcionario } from '@dto/funcionario.dto';
import { UsuariosService } from '@servicios/usuarios.service';
import { VentasService } from '@servicios/ventas.service';
import { IFiltroReporte } from '@util/interfaces/ifiltros-reporte.interface';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-reporte-ventas',
  templateUrl: './reporte-ventas.component.html',
  styleUrls: ['./reporte-ventas.component.scss']
})
export class ReporteVentasComponent implements OnInit {

  lstFiltrosReporte: IFiltroReporte[] = [];

  @Output()
  dataLoaded: EventEmitter<boolean> = new EventEmitter();
  @Input()
  private paramsFiltros: IParametroFiltro = {};
  public lstVentas: Venta[] = [];
  public cantRegistros: number = 0;
  public montoTotal: number = 0;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private usuariosSrv: UsuariosService,
    private ventasSrv: VentasService
  ) { }

  ngOnInit(): void {
    //this.cargarDatos();
  }

  cargarDatos() {
    let params: HttpParams = new HttpParams();
    params = params.append('eliminado', 'false');
    params = params.append('sort', '+cliente');
    params = params.appendAll(this.paramsFiltros);

    this.lstFiltrosReporte.push(this.getFechaFacturaFiltroReporte());
    this.lstFiltrosReporte.push(this.getEstadoFiltroReporte());
    this.lstFiltrosReporte.push(this.getFechaCobroFiltroReporte());
    
    const consultas: { [param:string]: Observable<any> }= {ventas: this.ventasSrv.get(params)};
    
    if(this.paramsFiltros['idfuncionarioregistrocobro']) consultas.funcionario = this.usuariosSrv.getPorId(Number(this.paramsFiltros['idfuncionarioregistrocobro']));
    if(this.paramsFiltros['idcobradorcomision']) consultas.cobrador = this.usuariosSrv.getPorId(Number(this.paramsFiltros['idcobradorcomision']));

    forkJoin(consultas).subscribe({
      next: (resp) =>{
        this.lstVentas = resp.ventas.data
        this.cantRegistros = resp.ventas.queryRowCount;
        this.lstFiltrosReporte.push(this.getUsuarioRegistroFiltroReporte(resp?.funcionario));
        this.lstFiltrosReporte.push(this.getCobradorFiltroReporte(resp?.cobrador));
        let total: number = 0
        this.lstVentas.forEach(v => total += Number(v.total));
        this.montoTotal = total;
        this.dataLoaded.emit(true);
      },
      error: (e) => {
        console.log('Error al cargar datos de ventas');
        console.log(e);
      }
    });
  }

  private getFechaFacturaFiltroReporte(): IFiltroReporte {
    const titulo: string = "Fecha factura";
    let desde: string = '*';
    let hasta: string = '*';
    if (this.paramsFiltros['fechainiciofactura']) {
      desde = formatDate(this.paramsFiltros['fechainiciofactura'].toString(), 'dd/MM/yy', this.locale);
    }
    if (this.paramsFiltros['fechafinfactura']) {
      hasta = formatDate(this.paramsFiltros['fechafinfactura'].toString(), 'dd/MM/yy', this.locale);
    }
    return { titulo, contenido: `desde ${desde} hasta ${hasta}` };
  }

  private getFechaCobroFiltroReporte(): IFiltroReporte {
    const titulo: string = "Fecha cobro";
    let desde: string = '*';
    let hasta: string = '*';
    if(this.paramsFiltros['fechainiciocobro']){
      desde = formatDate(this.paramsFiltros['fechainiciocobro'].toString(), 'dd/MM/yy', this.locale);
    }

    if(this.paramsFiltros['fechafincobro']){
      hasta = formatDate(this.paramsFiltros['fechafincobro'].toString(), 'dd/MM/yy', this.locale);
    }
    return { titulo, contenido: `desde ${desde} hasta ${hasta}` };
  }

  private getEstadoFiltroReporte(): IFiltroReporte {
    const titulo: string = 'Estado'
    let contenido: string = '*';
    if (this.paramsFiltros['anulado'] === 'true') {
      contenido = 'Anulado';
    }else{
      if(this.paramsFiltros['pagado'] !== null && this.paramsFiltros['pagado'] !== undefined){
        contenido = `${this.paramsFiltros['pagado']?'Pagado':'Pendiente'}`;
      }
    }
    return { titulo, contenido };
  }

  private getUsuarioRegistroFiltroReporte(usu: Funcionario | null): IFiltroReporte {
    const titulo: string = `Registrado por`;
    const contenido: string = usu?`${usu.razonsocial}`:'*';
    return { titulo, contenido };
  }

  private getCobradorFiltroReporte(cob: Funcionario): IFiltroReporte{
    const titulo: string = 'Cobrador';
    const contenido: string = cob?`${cob.razonsocial}`:'*';
    return { titulo, contenido };
  }

}
