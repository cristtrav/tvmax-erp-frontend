import { formatDate } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, Inject, LOCALE_ID, OnInit, ViewEncapsulation } from '@angular/core';
import { CobroDetalleVenta } from '@dto/cobro-detalle-venta.dto';
import { Grupo } from '@dto/grupo-dto';
import { Servicio } from '@dto/servicio-dto';
import { UsuarioDTO } from '@dto/usuario.dto';
import { CobrosService } from '@services/cobros.service';
import { GruposService } from '@services/grupos.service';
import { ServiciosService } from '@services/servicios.service';
import { UsuariosService } from '@services/usuarios.service';
import { IFiltroReporte } from 'src/app/global/interfaces/ifiltros-reporte.interface';
import { IParametroFiltro } from '@global-utils/iparametrosfiltros.interface';
import { Observable, catchError, forkJoin, of, tap } from 'rxjs';

@Component({
  selector: 'app-reporte-detalles-ventas',
  templateUrl: './reporte-detalles-ventas.component.html',
  styleUrls: ['./reporte-detalles-ventas.component.scss', '../estilos-tabla-reportes.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class ReporteDetallesVentasComponent implements OnInit {

  lstFiltrosReporte: IFiltroReporte[] = [];
  lstDetallesVentas: CobroDetalleVenta[] = [];
  cobradorFiltro: UsuarioDTO | null = null;
  montoTotal: number = 0;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private cobrosSrv: CobrosService,
    private usuariosSrv: UsuariosService,
    private gruposSrv: GruposService,
    private serviciosSrv: ServiciosService
  ) { }

  ngOnInit(): void {
  }

  cargarDatos(params: IParametroFiltro): Observable<any>{
    let httpParams = new HttpParams();
    httpParams = httpParams.appendAll(params);
    this.lstFiltrosReporte.push(this.getFiltroFechaCobro(params));
    this.lstFiltrosReporte.push(this.getFiltroFechaVenta(params));
    this.lstFiltrosReporte.push(this.getEstadoFiltroReporte(params));
    this.lstFiltrosReporte.push(this.getFiltroBusqueda(params));
    const consultas: {[name: string]: Observable<any>} = {
      detalles: this.cobrosSrv.getCobrosDetalles(httpParams)
    }
    if(params['idcobradorcomision'] != null)
      consultas.cobrador = this.usuariosSrv.getPorId(Number(params['idcobradorcomision']));
    if(params['idusuarioregistrocobro'] != null)
      consultas.usuario = this.usuariosSrv.getPorId(Number(params['idusuarioregistrocobro']));
    if(params['idgrupo'] != null && Array.isArray(params['idgrupo'])){
      let grupoParams = new HttpParams();
      for(let idgrp of params['idgrupo']) grupoParams = grupoParams.append('id', idgrp);      
      consultas.grupos = this.gruposSrv.getGrupos(grupoParams);
    }
    if(params['idservicio'] != null && Array.isArray(params['idservicio'])){
      let servicioParams = new HttpParams();
      for(let idsrv of params['idservicio']) servicioParams = servicioParams.append('id', idsrv);
      consultas.servicios = this.serviciosSrv.getServicios(servicioParams);
    }
      
    return forkJoin(consultas).pipe(
      tap(resp => {
        this.lstDetallesVentas = resp.detalles;
        this.lstFiltrosReporte.push(this.getFiltroCobrador(resp.cobrador));
        this.lstFiltrosReporte.push(this.getFiltroUsuario(resp.usuario));        
        this.lstFiltrosReporte.push(this.getFiltrosGrupos(resp.grupos, resp.servicios));
        
        let montoTotal = 0;
        this.lstDetallesVentas.forEach(dv => montoTotal += Number(dv.monto));
        this.montoTotal = montoTotal;
      }),
      catchError(e => {
        console.error('Error al cargar cobros', e);
        return of(e);
      })
    );
  }

  private getFiltroCobrador(cobrador: UsuarioDTO | null): IFiltroReporte{    
    return {
      titulo: 'Cobrador',
      contenido: cobrador != null ? `${cobrador.razonsocial}` : '*'
    }
  }

  private getFiltroUsuario(usuario: UsuarioDTO | null): IFiltroReporte{
    return {
      titulo: 'Cobro registrado por',
      contenido: usuario != null ? `${usuario.razonsocial}` : '*'
    }
  }

  private getFiltrosGrupos(grupos: Grupo[] | null, servicios: Servicio[] | null): IFiltroReporte{    
    let filtro: IFiltroReporte = {
      titulo: 'Grupos / Servicios'      
    }
    if(grupos == null && servicios == null) filtro.contenido = '*';
    else{
      filtro.contenidos = [];
      if(grupos != null) filtro.contenidos = filtro.contenidos.concat(grupos.map(grp => `${grp.descripcion} / *`));
      if(servicios != null) filtro.contenidos = filtro.contenidos.concat(servicios.map(srv => `${srv.grupo} / ${srv.descripcion}`));
    }
    return filtro;
  }

  private getFiltroFechaCobro(params: IParametroFiltro): IFiltroReporte{
    let desde = '*';
    let hasta = '*';
    if(params['fechainiciocobro'] != null) desde = formatDate(params['fechainiciocobro'].toString(), 'dd/MM/yyyy', this.locale)
    if(params['fechafincobro'] != null) hasta = formatDate(params['fechafincobro'].toString(), 'dd/MM/yyyy', this.locale);
    return {
      titulo: 'Fecha cobro',
      contenido: `desde ${desde} hasta ${hasta}`
    }
  }

  private getFiltroFechaVenta(params: IParametroFiltro): IFiltroReporte{
    let desde = '*';
    let hasta = '*';
    if(params['fechainiciofactura'] != null) desde = formatDate(params['fechainiciofactura'].toString(), 'dd/MM/yyyy', this.locale)
    if(params['fechafinfactura'] != null) hasta = formatDate(params['fechafinfactura'].toString(), 'dd/MM/yyyy', this.locale);
    return {
      titulo: 'Fecha factura',
      contenido: `desde ${desde} hasta ${hasta}`
    }
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

  private getFiltroBusqueda(params: IParametroFiltro): IFiltroReporte{
    return{
      titulo: 'Búsqueda',
      contenido: params['search'] ? `"${params['search']}"` : '-'
    }
  }

}
