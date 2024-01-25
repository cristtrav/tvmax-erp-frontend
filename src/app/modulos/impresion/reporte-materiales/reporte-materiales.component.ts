import { HttpParams } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import { MaterialDTO } from '@dto/material.dto';
import { TipoMaterialDTO } from '@dto/tipo-material.dto';
import { MaterialesService } from '@servicios/materiales.service';
import { TiposMaterialesService } from '@servicios/tipos-materiales.service';
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
  mapIdentificables = new Map<number, string[]>();
  lstFiltrosReporte: IFiltroReporte[] = [];
  totalRegistros: number = 0;

  lstTiposMateriales: TipoMaterialDTO[] = [];
  valorTotal: number = 0;

  constructor(
    private materialesSrv: MaterialesService,
    private tiposMaterialesSrv: TiposMaterialesService
  ){}

  cargarDatos(paramsFiltros: IParametroFiltro): Observable<any>{
    
    const httpParams = new HttpParams().appendAll(paramsFiltros);
    const paramsIdentificables = new HttpParams().append('disponible', true);

    return forkJoin({
      materiales: this.materialesSrv.get(httpParams),
      total: this.materialesSrv.getTotal(httpParams),
      identificables: this.materialesSrv.getIdentificables(paramsIdentificables),
      tiposMateriales: this.getTiposMaterialesObs(paramsFiltros)
    })
    .pipe(
      tap((resp) => {
        this.valorTotal = 0;
        this.lstMateriales = resp.materiales;
        this.totalRegistros = resp.total;
        resp.materiales.forEach(
          m => {
            this.valorTotal = this.valorTotal + Number(m.preciototal);
            this.mapIdentificables.set(
            m.id,
            resp.identificables.filter(idn => idn.idmaterial == m.id).map(idnf => idnf.serial))
          }
        );
        console.log('tipos materiales consultados', resp.tiposMateriales);
        this.lstTiposMateriales = resp.tiposMateriales;
        this.lstFiltrosReporte = this.getFiltrosReportes(paramsFiltros);
      }),
      catchError((e) => {
        console.error('Error al cargar materiales para reporte', e);
        return of(e);
      })
    );
  }

  private getTiposMaterialesObs(paramsFiltros: IParametroFiltro): Observable<TipoMaterialDTO[]>{
    const id = paramsFiltros['idtipomaterial'];
    if(Array.isArray(id)){
      const params = new HttpParams().appendAll({ id });
      return this.tiposMaterialesSrv.get(params);
    }else return of([]);
  }

  private getFiltrosReportes(paramsFiltros: IParametroFiltro): IFiltroReporte[]{
    return [
      {titulo: 'Búsqueda', contenido: paramsFiltros.search?.toString() ?? '-'},
      {
        titulo: 'Grupos',
        contenido: this.lstTiposMateriales.length == 0 ? '*' : this.lstTiposMateriales.map(tm => tm.descripcion).join(', ')
      }
    ]
  }

}
