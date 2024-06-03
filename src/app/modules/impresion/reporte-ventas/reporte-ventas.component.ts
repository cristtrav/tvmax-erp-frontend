import { formatDate } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, Inject, LOCALE_ID, OnInit, ViewEncapsulation } from '@angular/core';
import { Venta } from '@dto/venta.dto';
import { UsuarioDTO } from '@dto/usuario.dto';
import { UsuariosService } from '@services/usuarios.service';
import { VentasService } from '@services/ventas.service';
import { IFiltroReporte } from '@util/interfaces/ifiltros-reporte.interface';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { catchError, forkJoin, Observable, of, tap } from 'rxjs';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';

@Component({
  selector: 'app-reporte-ventas',
  templateUrl: './reporte-ventas.component.html',
  styleUrls: ['./reporte-ventas.component.scss', './../estilos-tabla-reportes.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class ReporteVentasComponent implements OnInit {

  lstFiltrosReporte: IFiltroReporte[] = [];

  private paramsFiltros: IParametroFiltro = {};
  public lstVentas: Venta[] = [];
  public cantRegistros: number = 0;
  public montoTotal: number = 0;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private usuariosSrv: UsuariosService,
    private ventasSrv: VentasService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
  }

  cargarDatos(paramsFiltros: IParametroFiltro): Observable<any> {
    this.paramsFiltros = paramsFiltros;
    let params: HttpParams = new HttpParams();    
    params = params.append('sort', '+cliente');
    params = params.appendAll(this.paramsFiltros);

    this.lstFiltrosReporte.push(this.getFechaFacturaFiltroReporte(paramsFiltros));
    this.lstFiltrosReporte.push(this.getEstadoFiltroReporte(paramsFiltros));
    this.lstFiltrosReporte.push(this.getFechaCobroFiltroReporte(paramsFiltros));
    this.lstFiltrosReporte.push(this.getFiltroBusqueda(paramsFiltros));

    const consultas: { [param: string]: Observable<any> } = {
      ventas: this.ventasSrv.get(params),
      total: this.ventasSrv.getTotal(params)
    };
    if (this.paramsFiltros['idfuncionarioregistrocobro']) consultas.funcionario = this.usuariosSrv.getPorId(Number(this.paramsFiltros['idfuncionarioregistrocobro']));
    if (this.paramsFiltros['idcobradorcomision']) consultas.cobrador = this.usuariosSrv.getPorId(Number(this.paramsFiltros['idcobradorcomision']));

    return forkJoin(consultas).pipe(
      tap(resp => {
        this.lstVentas = resp.ventas;
        this.cantRegistros = resp.total;
        this.lstFiltrosReporte.push(this.getUsuarioRegistroFiltroReporte(resp?.funcionario));
        this.lstFiltrosReporte.push(this.getCobradorFiltroReporte(resp?.cobrador));
        let total: number = 0
        this.lstVentas.forEach(v => total += Number(v.total));
        this.montoTotal = total;
      }),
      catchError(e => {
        console.error('Error al caragar reporte de ventas', e);
        this.httpErrorHandler.process(e);
        return of(e);
      })
    );
  }

  private getFechaFacturaFiltroReporte(params: IParametroFiltro): IFiltroReporte {
    const titulo: string = "Fecha factura";
    let desde: string = '*';
    let hasta: string = '*';
    if (params['fechainiciofactura']) {
      desde = formatDate(params['fechainiciofactura'].toString(), 'dd/MM/yy', this.locale);
    }
    if (params['fechafinfactura']) {
      hasta = formatDate(params['fechafinfactura'].toString(), 'dd/MM/yy', this.locale);
    }
    return { titulo, contenido: `desde ${desde} hasta ${hasta}` };
  }

  private getFechaCobroFiltroReporte(params: IParametroFiltro): IFiltroReporte {
    const titulo: string = "Fecha cobro";
    let desde: string = '*';
    let hasta: string = '*';
    if (params['fechainiciocobro']) {
      desde = formatDate(params['fechainiciocobro'].toString(), 'dd/MM/yy', this.locale);
    }

    if (params['fechafincobro']) {
      hasta = formatDate(params['fechafincobro'].toString(), 'dd/MM/yy', this.locale);
    }
    return { titulo, contenido: `desde ${desde} hasta ${hasta}` };
  }

  private getEstadoFiltroReporte(params: IParametroFiltro): IFiltroReporte {
    const titulo: string = 'Estado'
    let contenido: string = '*';
    if (params['anulado'] === 'true') {
      contenido = 'Anulado';
    } else {
      if (params['pagado'] !== null && params['pagado'] !== undefined) {
        contenido = `${params['pagado'] ? 'Pagado' : 'Pendiente'}`;
      }
    }
    return { titulo, contenido };
  }

  private getUsuarioRegistroFiltroReporte(usu: UsuarioDTO | null): IFiltroReporte {
    const titulo: string = `Registrado por`;
    const contenido: string = usu ? `${usu.razonsocial}` : '*';
    return { titulo, contenido };
  }

  private getCobradorFiltroReporte(cob: UsuarioDTO): IFiltroReporte {
    const titulo: string = 'Cobrador';
    const contenido: string = cob ? `${cob.razonsocial}` : '*';
    return { titulo, contenido };
  }

  private getFiltroBusqueda(params: IParametroFiltro): IFiltroReporte{
    return{
      titulo: 'Búsqueda',
      contenido: params['search'] ? `"${params['search']}"` : '-'
    }
  }

}
