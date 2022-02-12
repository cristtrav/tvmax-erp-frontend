import { HttpParams } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Grupo } from '@dto/grupo-dto';
import { ServerResponseList } from '@dto/server-response-list.dto';
import { Servicio } from '@dto/servicio-dto';
import { GruposService } from '@servicios/grupos.service';
import { ServiciosService } from '@servicios/servicios.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { NzMarks } from 'ng-zorro-antd/slider';
import { NzFormatEmitEvent, NzTreeNodeOptions } from 'ng-zorro-antd/tree';

@Component({
  selector: 'app-form-filtro-suscripciones',
  templateUrl: './form-filtro-suscripciones.component.html',
  styleUrls: ['./form-filtro-suscripciones.component.scss']
})
export class FormFiltroSuscripcionesComponent implements OnInit {

  @Output()
  paramsFiltrosChange = new EventEmitter<IParametroFiltro>();
  
  @Output()
  cantFiltrosChange = new EventEmitter<number>();

  gruposServiciosFiltro: string [] = [];
  gruposServiciosFiltroNodos: NzTreeNodeOptions[] = [];

  fechaInicioFiltro: Date | null = null;
  fechaFinFiltro: Date | null = null;

  filtroConectado: boolean = false;
  filtroReconectado: boolean = false;
  filtroDesconectado: boolean = false;

  rangoCuotasPendFiltro: number[] = [0, 13];
  marcasFiltroCuotasPend: NzMarks = {
    '0': '0',
    '12': '12',
    '13': '∞'
  };

  timerFiltroCuotasPend: any;

  ubicacionesFiltroNodos: NzTreeNodeOptions[] = [];
  ubicacionesFiltro: string[] = [];

  constructor(
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private gruposSrv: GruposService,
    private serviciosSrv: ServiciosService
  ) {}

  ngOnInit(): void {
    this.cargarGruposFiltro();
  }

  limpiarFiltrosEstados(){
    this.filtroConectado = false;
    this.filtroReconectado = false;
    this.filtroDesconectado = false;
    this.filtrar();
  }

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.fechaFinFiltro) {
      return false;
    }
    const ffd: Date = new Date(this.fechaFinFiltro.getFullYear(), this.fechaFinFiltro.getMonth(), this.fechaFinFiltro.getDate() + 1);
    return startValue.getTime() > ffd.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.fechaInicioFiltro) {
      return false;
    }
    const fid: Date = new Date(this.fechaInicioFiltro.getFullYear(), this.fechaInicioFiltro.getMonth(), this.fechaInicioFiltro.getDate()-1);
    return endValue.getTime() <= fid.getTime();
  };

  cargarGruposFiltro(){
    let params: HttpParams = new HttpParams();
    params = params.append('eliminado', false);
    params = params.append('sort', '+descripcion');
    this.gruposSrv.getGrupos(params).subscribe((resp: ServerResponseList<Grupo>)=>{
      const nodes: NzTreeNodeOptions[] = [];
      resp.data.forEach((g: Grupo)=>{
        const node: NzTreeNodeOptions = {
          title: `${g.descripcion}`,
          key: `gru-${g.id}`
        }
        nodes.push(node);
        this.gruposServiciosFiltroNodos = nodes;
      });
      this.gruposServiciosFiltro
    }, (e)=>{
      console.log('Error al cargar grupos filtro');
      console.log(e);
      this.httpErrorHandler.handle(e);
    });
  }

  filtrar(){
    this.cantFiltrosChange.emit(this.calcularCantFiltros());
    this.paramsFiltrosChange.emit(this.getHttpQueryParams());
  }

  calcularCantFiltros(): number{
    let cant: number = 0;
    cant += this.gruposServiciosFiltro.length;
    if(this.fechaFinFiltro) cant++;
    if(this.fechaFinFiltro) cant++;
    if(this.filtroConectado) cant++;
    if(this.filtroReconectado) cant++;
    if(this.filtroDesconectado) cant++;
    if(this.rangoCuotasPendFiltro[0] !== 0 || this.rangoCuotasPendFiltro[1] !== 13){
      cant ++;
    }
    return cant;
  }

  limpiarFiltrosGruposServicios(){
    this.gruposServiciosFiltro = [];
    this.filtrar();
  }

  limpiarFiltrosFechaSuscripcion(){
    this.fechaInicioFiltro = null;
    this.fechaFinFiltro = null;
    this.filtrar();
  }

  limpiarFiltroRangoCuotasPendientes(){
    this.rangoCuotasPendFiltro = [0, 13];
    this.filtrar();
  }

  cambioFiltroRango(){
    clearTimeout(this.timerFiltroCuotasPend);
    this.timerFiltroCuotasPend = setTimeout(()=>{
      this.filtrar();
    }, 500);
  }

  formatterTooltipRangoCuotas(value: number): string {
    if(value === 13) return 'Sin límite'
    return `${value}`;
  }

  cargarNodoServicio(ev: NzFormatEmitEvent){
    const node = ev.node;
    if (node && node.getChildren().length === 0 && node.isExpanded) {
      let params: HttpParams = new HttpParams();
      params = params.append('eliminado', 'false');
      params = params.append('sort', '+descripcion');
      params = params.append('idgrupo', `${node.key.split('-')[1]}`);
      this.serviciosSrv.getServicios(params).subscribe((resp: ServerResponseList<Servicio>)=>{
        const serviciosNodo: NzTreeNodeOptions[] = [];
        resp.data.forEach((s: Servicio)=>{
          const datosNodo: NzTreeNodeOptions = {
            title: `${s.descripcion}`,
            key: `ser-${s.id}`,
            isLeaf: true,
            checked: node.isChecked
          }
          serviciosNodo.push(datosNodo);
        });
        node.addChildren(serviciosNodo);
      }, (e)=>{
        console.log('Error al cargar servicios del nodo');
        console.log(e);
        this.httpErrorHandler.handle(e);
      });
    }
  }
  
  cargarDepartamentosFiltro(){
    let params: HttpParams = new HttpParams();
    params = params.append('eliminado', 'false');
    params = params.append('sort', '+descripcion');
    
  }

  getHttpQueryParams(): IParametroFiltro {
    const params: IParametroFiltro = {};
    const idgrupos: number[] = [];
    const idservicios: number[] = [];    
    this.gruposServiciosFiltro.forEach((gs: string)=>{
      if(gs.split('-')[0] === 'gru') idgrupos.push(Number(gs.split('-')[1]));
      if(gs.split('-')[0] === 'ser') idservicios.push(Number(gs.split('-')[1]));
    });
    if(idgrupos.length !== 0) params['idgrupo'] = idgrupos;
    if(idservicios.length !== 0) params['idservicio'] = idservicios;

    if(this.fechaInicioFiltro){
      const finiciostr: string = `${this.fechaInicioFiltro.getFullYear()}-${(this.fechaInicioFiltro.getMonth() + 1).toString().padStart(2 ,'0')}-${this.fechaInicioFiltro.getDate().toString().padStart(2, '0')}`;
      params['fechainiciosuscripcion'] = finiciostr;
    }
    if(this.fechaFinFiltro){
      const ffinstr: string = `${this.fechaFinFiltro.getFullYear()}-${(this.fechaFinFiltro.getMonth() + 1).toString().padStart(2 ,'0')}-${this.fechaFinFiltro.getDate().toString().padStart(2, '0')}`;
      params['fechafinsuscripcion'] = ffinstr;
    }

    const estados: string[] = [];
    if(this.filtroConectado || this.filtroReconectado || this.filtroDesconectado){
      if(this.filtroConectado) estados.push('C');
      if(this.filtroReconectado) estados.push('R');
      if(this.filtroDesconectado) estados.push('D');
    }
    if(estados.length !== 0) params['estado'] = estados;

    if(this.rangoCuotasPendFiltro[0] !== 0 || this.rangoCuotasPendFiltro[1] !== 13){
      params['cuotaspendientesdesde'] = this.rangoCuotasPendFiltro[0];
      if(this.rangoCuotasPendFiltro[1] !== 13) params['cuotaspendienteshasta'] = this.rangoCuotasPendFiltro[1];
    }
    return params;
  }

  /*cargarParametros(p: IParametroFiltro){
    if(p['fechainiciosuscripcion'] && typeof p['fechainiciosuscripcion'] === 'string'){
      this.fechaInicioFiltro = new Date(Date.parse(p['fechainiciosuscripcion']));
    }
    if(p['fechafinsuscripcion'] && typeof p['fechafinsuscripcion'] === 'string'){
      this.fechaFinFiltro = new Date(Date.parse(p['fechafinsuscripcion']));
    }
    const idgs: string[] = [];
    if(p['idgrupo'] && Array.isArray(p['idgrupo'])){
      p['idgrupo'].forEach((idg)=>{
        idgs.push(`gru-${idg}`);
      });
    }
    const idss: string[] = [];
    if(p['idservicio'] && Array.isArray(p['idservicio'])){
      p['idservicio'].forEach((ids)=>{
        idss.push(`ser-${ids}`);
      });
    }
    this.gruposServiciosFiltro = idgs.concat(idss);
    console.log(this.gruposServiciosFiltro);
  }*/

}
