import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Departamento } from '@dto/departamento-dto';
import { Distrito } from '@dto/distrito-dto';
import { DepartamentosService } from '@services/departamentos.service';
import { DistritosService } from '@services/distritos.service';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { IParametroFiltro } from '@global-utils/iparametrosfiltros.interface';

@Component({
  selector: 'app-form-filtro-barrios',
  templateUrl: './form-filtro-barrios.component.html',
  styleUrls: ['./form-filtro-barrios.component.scss']
})
export class FormFiltroBarriosComponent implements OnInit {

  @Output()
  paramsFiltrosChange = new EventEmitter<IParametroFiltro>();

  @Output()
  cantFiltrosChange = new EventEmitter<number>();

  lstDepartamentos: Departamento[] = [];
  loadingDepartamentos: boolean = false;
  idDepartamentoSeleccion: string | null = null;

  lstDistritos: Distrito[] = [];
  loadingDistritos: boolean = false;
  idDistritoSeleccion: string | null = null;

  constructor(
    private departamentosSrv: DepartamentosService,
    private distritosSrv: DistritosService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    this.cargarDepartamentos();
  }

  cargarDepartamentos() {
    this.loadingDepartamentos = true;
    let httpParams: HttpParams = new HttpParams();
    httpParams = httpParams.append('eliminado', 'false');
    httpParams = httpParams.append('sort', '+descripcion');
    this.departamentosSrv.get(httpParams).subscribe({
      next: (resp) => {
        this.lstDepartamentos = resp;
        this.loadingDepartamentos = false;
      },
      error: (e) => {
        console.log('Error al cargar departamentos');
        console.log(e);
        this.httpErrorHandler.handle(e);
        this.loadingDepartamentos = false;
      }
    });
  }

  cargarDistritos(): void {
    this.loadingDistritos = true;
    let httpParams: HttpParams = new HttpParams();
    httpParams = httpParams.append('eliminado', 'false');
    httpParams = httpParams.append('sort', '+descripcion');
    httpParams = httpParams.append('iddepartamento', `${this.idDepartamentoSeleccion}`);
    this.distritosSrv.get(httpParams).subscribe({
      next: (distritos) => {
        this.lstDistritos = distritos;
        this.loadingDistritos = false;
      },
      error: (e) => {
        console.log('Error al cargar distritos');
        console.log(e);
        this.httpErrorHandler.process(e);
        this.loadingDistritos = false;
      }
    });
  }

  seleccionDepartamento() {
    if (this.idDepartamentoSeleccion) this.cargarDistritos();
    this.filtrar();
  }

  seleccionDistrito() {
    this.filtrar();
  }

  limpiarFiltroDepartamento() {
    this.idDistritoSeleccion = null;
    this.idDepartamentoSeleccion = null;
    this.lstDistritos = [];
    this.filtrar();
  }

  limpiarFiltroDistrito() {
    this.idDistritoSeleccion = null;
    this.filtrar();
  }

  getQueryParams(): IParametroFiltro {
    const params: IParametroFiltro = {};
    if (this.idDistritoSeleccion) {
      params['iddistrito'] = this.idDistritoSeleccion;
    } else if (this.idDepartamentoSeleccion) {
      params['iddepartamento'] = this.idDepartamentoSeleccion;
    }
    return params;
  }

  getCantidadFiltros(): number{
    let cant: number = 0;
    if(this.idDepartamentoSeleccion) cant++;
    if(this.idDistritoSeleccion) cant++;
    return cant;
  }

  filtrar(){
    this.cantFiltrosChange.emit(this.getCantidadFiltros());
    this.paramsFiltrosChange.emit(this.getQueryParams())
  }

}
