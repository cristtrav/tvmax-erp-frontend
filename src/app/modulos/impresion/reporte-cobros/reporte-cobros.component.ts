import { formatDate } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, Inject, LOCALE_ID, OnInit, ViewEncapsulation } from '@angular/core';
import { CobroDetalleVenta } from '@dto/cobro-detalle-venta.dto';
import { Grupo } from '@dto/grupo-dto';
import { Servicio } from '@dto/servicio-dto';
import { Usuario } from '@dto/usuario.dto';
import { CobrosService } from '@servicios/cobros.service';
import { GruposService } from '@servicios/grupos.service';
import { ServiciosService } from '@servicios/servicios.service';
import { UsuariosService } from '@servicios/usuarios.service';
import { IFiltroReporte } from '@util/interfaces/ifiltros-reporte.interface';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { Observable, catchError, forkJoin, of, tap } from 'rxjs';

@Component({
  selector: 'app-reporte-cobros',
  templateUrl: './reporte-cobros.component.html',
  styleUrls: ['./reporte-cobros.component.scss', '../estilos-tabla-reportes.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class ReporteCobrosComponent implements OnInit {

  lstFiltrosReporte: IFiltroReporte[] = [];
  lstCobros: CobroDetalleVenta[] = [];
  cobradorFiltro: Usuario | null = null;

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
    console.log(params);
    this.lstFiltrosReporte.push(this.getFiltroFecha(params));
    const consultas: {[name: string]: Observable<any>} = {
      cobros: this.cobrosSrv.getCobrosDetalles(httpParams)
    }
    if(params['idcobradorcomision'] != null)
      consultas.cobrador = this.usuariosSrv.getPorId(Number(params['idcobradorcomision']));
    if(params['idusuario'] != null)
      consultas.usuario = this.usuariosSrv.getPorId(Number(params['idusuario']));
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
        this.lstCobros = resp.cobros;
        this.lstFiltrosReporte.push(this.getFiltroCobrador(resp.cobrador));
        this.lstFiltrosReporte.push(this.getFiltroUsuario(resp.usuario));        
        this.lstFiltrosReporte.push(this.getFiltrosGrupos(resp.grupos, resp.servicios));
      }),
      catchError(e => {
        console.error('Error al cargar cobros', e);
        return of(e);
      })
    );
  }

  private getFiltroCobrador(cobrador: Usuario | null): IFiltroReporte{    
    return {
      titulo: 'Cobrador',
      contenido: cobrador != null ? `${cobrador.razonsocial}` : '*'
    }
  }

  private getFiltroUsuario(usuario: Usuario | null): IFiltroReporte{
    return {
      titulo: 'Registrado por',
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

  private getFiltroFecha(params: IParametroFiltro): IFiltroReporte{
    let desde = '*';
    let hasta = '*';
    if(params['fechainiciocobro'] != null) desde = formatDate(params['fechainiciocobro'].toString(), 'dd/MM/yyyy', this.locale)
    if(params['fechafincobro'] != null) hasta = formatDate(params['fechafincobro'].toString(), 'dd/MM/yyyy', this.locale);
    return {
      titulo: 'Fecha de cobro',
      contenido: `desde ${desde} hasta ${hasta}`
    }
  }

}
