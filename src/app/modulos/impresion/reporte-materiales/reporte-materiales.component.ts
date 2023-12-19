import { HttpParams } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import { MaterialDTO } from '@dto/material.dto';
import { MaterialesService } from '@servicios/materiales.service';
import { IFiltroReporte } from '@util/interfaces/ifiltros-reporte.interface';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { Observable, catchError, forkJoin, of, tap } from 'rxjs';

@Component({
  selector: 'app-reporte-materiales',
  templateUrl: './reporte-materiales.component.html',
  styleUrls: ['./reporte-materiales.component.scss', './../estilos-tabla-reportes.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class ReporteMaterialesComponent {

  lstMateriales: MaterialDTO[] = [];
  lstFiltrosReporte: IFiltroReporte[] = [];
  totalRegistros: number = 0;

  constructor(
    private materialesSrv: MaterialesService
  ){}

  cargarDatos(paramsFiltros: IParametroFiltro): Observable<any>{
    this.lstFiltrosReporte = this.getFiltrosReportes(paramsFiltros);
    const httpParams = new HttpParams().appendAll(paramsFiltros);
    return forkJoin({
      materiales: this.materialesSrv.get(httpParams),
      total: this.materialesSrv.getTotal(httpParams)
    })
    .pipe(
      tap((resp) => {
        this.lstMateriales = resp.materiales;
        this.totalRegistros = resp.total;
      }),
      catchError((e) => {
        console.error('Error al cargar materiales para reporte', e);
        return of(e);
      })
    );
  }

  private getFiltrosReportes(paramsFiltros: IParametroFiltro): IFiltroReporte[]{
    return [
      {titulo: 'Búsqueda', contenido: paramsFiltros.search?.toString() ?? '-'}
    ]
  }

}
