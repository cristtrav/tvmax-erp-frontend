import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TipoMaterialDTO } from '@dto/depositos/tipo-material.dto';
import { TiposMaterialesService } from '@global-services/depositos/tipos-materiales.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-form-filtro-materiales',
  templateUrl: './form-filtro-materiales.component.html',
  styleUrls: ['./form-filtro-materiales.component.scss']
})
export class FormFiltroMaterialesComponent implements OnInit {

  @Output()
  paramsFiltrosChange = new EventEmitter<IParametroFiltro>();
  
  @Output()
  cantFiltrosChange = new EventEmitter<number>();

  paramsFiltros: IParametroFiltro = {};
  cantFiltros: number = 0;

  tiposMaterialesSelec: number[] = [];
  lstTiposMateriales: TipoMaterialDTO[] = [];
  loadingTiposMateriales: boolean = false;

  constructor(
    private tiposMaterialesSrv: TiposMaterialesService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ){}

  ngOnInit(): void {
    this.cargarTiposMateriales();
  }

  cargarTiposMateriales(){
    this.loadingTiposMateriales = true;
    const params = new HttpParams().append('eliminado', 'false');
    this.tiposMaterialesSrv.get(params)
    .pipe(finalize(() => this.loadingTiposMateriales = false))
    .subscribe({
      next: (tiposMateriales) => {
        this.lstTiposMateriales = tiposMateriales;
      },
      error: (e) => {
        console.error('Error al cargar tipos de materiales', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

  limpiarFiltroTiposMateriales(){
    this.tiposMaterialesSelec = [];
    this.filtrar();
  }

  filtrar(){
    this.paramsFiltrosChange.emit(this.getQueryParams());
    this.cantFiltrosChange.emit(this.getCantidadFiltros());
  }

  private getQueryParams(): IParametroFiltro{
    const params: IParametroFiltro = {};
    if(this.tiposMaterialesSelec.length > 0) params['idtipomaterial'] = this.tiposMaterialesSelec;
    return params;
  }

  private getCantidadFiltros(): number{
    let cantidad: number = 0;
    if(this.tiposMaterialesSelec.length > 0) cantidad++;
    return cantidad;
  }

}
