import { formatDate } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, Inject, LOCALE_ID, OnInit, ViewEncapsulation } from '@angular/core';
import { Venta } from '@dto/venta.dto';
import { Usuario } from '@dto/usuario.dto';
import { UsuariosService } from '@servicios/usuarios.service';
import { VentasService } from '@servicios/ventas.service';
import { IFiltroReporte } from '@util/interfaces/ifiltros-reporte.interface';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { catchError, forkJoin, Observable, of, tap } from 'rxjs';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';

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
    params = params.append('eliminado', 'false');
    params = params.append('sort', '+cliente');
    params = params.appendAll(this.paramsFiltros);

    this.lstFiltrosReporte.push(this.getFechaFacturaFiltroReporte());
    this.lstFiltrosReporte.push(this.getEstadoFiltroReporte());
    this.lstFiltrosReporte.push(this.getFechaCobroFiltroReporte());

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
    if (this.paramsFiltros['fechainiciocobro']) {
      desde = formatDate(this.paramsFiltros['fechainiciocobro'].toString(), 'dd/MM/yy', this.locale);
    }

    if (this.paramsFiltros['fechafincobro']) {
      hasta = formatDate(this.paramsFiltros['fechafincobro'].toString(), 'dd/MM/yy', this.locale);
    }
    return { titulo, contenido: `desde ${desde} hasta ${hasta}` };
  }

  private getEstadoFiltroReporte(): IFiltroReporte {
    const titulo: string = 'Estado'
    let contenido: string = '*';
    if (this.paramsFiltros['anulado'] === 'true') {
      contenido = 'Anulado';
    } else {
      if (this.paramsFiltros['pagado'] !== null && this.paramsFiltros['pagado'] !== undefined) {
        contenido = `${this.paramsFiltros['pagado'] ? 'Pagado' : 'Pendiente'}`;
      }
    }
    return { titulo, contenido };
  }

  private getUsuarioRegistroFiltroReporte(usu: Usuario | null): IFiltroReporte {
    const titulo: string = `Registrado por`;
    const contenido: string = usu ? `${usu.razonsocial}` : '*';
    return { titulo, contenido };
  }

  private getCobradorFiltroReporte(cob: Usuario): IFiltroReporte {
    const titulo: string = 'Cobrador';
    const contenido: string = cob ? `${cob.razonsocial}` : '*';
    return { titulo, contenido };
  }

}
