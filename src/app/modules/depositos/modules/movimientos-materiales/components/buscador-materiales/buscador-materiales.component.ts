import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MaterialDTO } from '@dto/depositos/material.dto';
import { MaterialesService } from '@global-services/depositos/materiales.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { finalize, forkJoin } from 'rxjs';

@Component({
  selector: 'app-buscador-materiales',
  templateUrl: './buscador-materiales.component.html',
  styleUrls: ['./buscador-materiales.component.scss']
})
export class BuscadorMaterialesComponent implements OnInit {

  @Input()
  disabled: boolean = false;
  @Input()
  menuMaterialesVisible: boolean = false;
  @Output()
  materialSelected = new EventEmitter<MaterialDTO>();
  
  lstMateriales: MaterialDTO[] = [];
  totalMateriales: number = 0;
  textoBusquedaMaterial: string = '';
  timerBusquedaMaterial: any;
  loadingMateriales: boolean = false;
  idMaterialSeleccionado: number | null = null;  
  
  limitMateriales = 8;

  constructor(
    private materialesSrv: MaterialesService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ){}

  ngOnInit(): void {
    this.cargarMateriales('inicio');
  }

  cargarMateriales(modo: 'inicio' | 'mas'){
    this.loadingMateriales = true;
    let httpParams = new HttpParams()
      .append('eliminado', 'false')
      .append('limit', this.limitMateriales);
    if(this.textoBusquedaMaterial) httpParams = httpParams.append('search', this.textoBusquedaMaterial);
    if(modo === 'mas') httpParams = httpParams.append('offset', this.lstMateriales.length);

    forkJoin({
      materiales: this.materialesSrv.get(httpParams),
      total: this.materialesSrv.getTotal(httpParams)
    })
    .pipe(finalize(() => this.loadingMateriales = false))
    .subscribe({
      next: (resp) => {
        if(modo === 'inicio') this.lstMateriales = resp.materiales;
        if(modo === 'mas') this.lstMateriales = this.lstMateriales.concat(resp.materiales);
        this.totalMateriales = resp.total;
      },
      error: (e) => {
        console.error('Error al cargar materiales', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

  buscarMaterial(){
    this.menuMaterialesVisible = true;
    clearTimeout(this.timerBusquedaMaterial);
    this.timerBusquedaMaterial = setTimeout(() => {
      this.cargarMateriales('inicio');
    }, 300);
  }

  limpiarBusquedaMaterial(){
    this.textoBusquedaMaterial = '';
    this.cargarMateriales('inicio');
  }

  limpiarBusquedaAlAbrirMenuMaterial(){
    if(this.menuMaterialesVisible && this.textoBusquedaMaterial != '')
      this.limpiarBusquedaMaterial();
  }

  seleccionarMaterial(material: MaterialDTO){
    this.materialSelected.emit(material);
    this.menuMaterialesVisible = false;
  }

  reset(){
    this.textoBusquedaMaterial = '';
    this.cargarMateriales('inicio');
  }

}
