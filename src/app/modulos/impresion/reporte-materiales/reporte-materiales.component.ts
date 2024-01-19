import { HttpParams } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import { MaterialIdentificableDTO } from '@dto/material-identificable.dto';
import { MaterialDTO } from '@dto/material.dto';
import { MaterialesService } from '@servicios/materiales.service';
import { IFiltroReporte } from '@util/interfaces/ifiltros-reporte.interface';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { Observable, catchError, forkJoin, mergeMap, of, tap } from 'rxjs';

@Component({
  selector: 'app-reporte-materiales',
  templateUrl: './reporte-materiales.component.html',
  styleUrls: ['./reporte-materiales.component.scss', './../estilos-tabla-reportes.scss'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class ReporteMaterialesComponent {

  lstMateriales: MaterialDTO[] = [];
  mapIdentificables = new Map<number, string[]>();
  lstFiltrosReporte: IFiltroReporte[] = [];
  totalRegistros: number = 0;

  constructor(
    private materialesSrv: MaterialesService
  ){}

  cargarDatos(paramsFiltros: IParametroFiltro): Observable<any>{
    this.lstFiltrosReporte = this.getFiltrosReportes(paramsFiltros);
    const httpParams = new HttpParams().appendAll(paramsFiltros);
    const paramsIdentificables = new HttpParams().append('disponible', true);

    return forkJoin({
      materiales: this.materialesSrv.get(httpParams),
      total: this.materialesSrv.getTotal(httpParams),
      identificables: this.materialesSrv.getIdentificables(paramsIdentificables)
    })
    .pipe(
      tap((resp) => {
        this.lstMateriales = resp.materiales;
        this.totalRegistros = resp.total;
        resp.materiales.forEach(
          m => this.mapIdentificables.set(
            m.id,
            resp.identificables.filter(idn => idn.idmaterial == m.id).map(idnf => idnf.serial))
        );
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
