import { HttpParams } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Barrio } from '@dto/barrio-dto';
import { Departamento } from '@dto/departamento-dto';
import { Distrito } from '@dto/distrito-dto';
import { Grupo } from '@dto/grupo-dto';
import { ServerResponseList } from '@dto/server-response-list.dto';
import { Servicio } from '@dto/servicio-dto';
import { BarriosService } from '@servicios/barrios.service';
import { DepartamentosService } from '@servicios/departamentos.service';
import { DistritosService } from '@servicios/distritos.service';
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
    private serviciosSrv: ServiciosService,
    private departamentosSrv: DepartamentosService,
    private distritosSrv: DistritosService,
    private barriosSrv: BarriosService
  ) {}

  ngOnInit(): void {
    this.cargarGruposFiltro();
    this.cargarDepartamentosFiltro();
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
    cant += this.ubicacionesFiltro.length;
    if(this.fechaInicioFiltro) cant++;
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

  limpiarFiltrosUbicacion() {
    this.ubicacionesFiltro = [];
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
    this.departamentosSrv.get(params).subscribe((resp: ServerResponseList<Departamento>)=>{
      const nodes: NzTreeNodeOptions[] = [];
      resp.data.forEach((d: Departamento)=>{
        const node: NzTreeNodeOptions = {
          title: `${d.descripcion}`,
          key: `dep-${d.id}`
        };
        nodes.push(node);
      });
      this.ubicacionesFiltroNodos = nodes;
    }, (e)=>{
      console.log('Error al cargar deparatamentos filtro');
      console.log(e);
      this.httpErrorHandler.handle(e);
    });
  }

  cargarNodoCiudadBarrio(ev: NzFormatEmitEvent){
    const node = ev.node;
    if (node && node.getChildren().length === 0 && node.isExpanded) {
      if(node.key.includes('dep')){
        let params: HttpParams = new HttpParams();
        params = params.append('eliminado', 'false');
        params = params.append('sort', '+descripcion');
        params = params.append('iddepartamento', node.key.split('-')[1]);
        this.distritosSrv.get(params).subscribe((resp: ServerResponseList<Distrito>)=>{
          const nodesDistrito: NzTreeNodeOptions[] = [];
          resp.data.forEach((d: Distrito)=>{
            const nodeDistrito: NzTreeNodeOptions = {
              title: `${d.descripcion}`,
              key: `dis-${d.id}`,
              checked: node.isChecked
            };
            nodesDistrito.push(nodeDistrito);
          });
          node.addChildren(nodesDistrito);
        }, (e)=>{
          console.log('Error al cargar distritos filtro');
          console.log(e);
          this.httpErrorHandler.handle(e);
        });
      }else{
        let params: HttpParams = new HttpParams();
        params = params.append('eliminado', 'false');
        params = params.append('sort', '+descripcion');
        params = params.append('iddistrito', node.key.split('-')[1]);
        this.barriosSrv.get(params).subscribe((resp: ServerResponseList<Barrio>)=>{
          const nodesBarrios: NzTreeNodeOptions[] = [];
          resp.data.forEach((b: Barrio)=>{
            const nodeBarrio: NzTreeNodeOptions = {
              title: `${b.descripcion}`,
              key: `bar-${b.id}`,
              isLeaf: true,
              checked: node.isChecked
            };
            nodesBarrios.push(nodeBarrio);
          });
          node.addChildren(nodesBarrios);
        }, (e)=>{
          console.log('Error al cargar barrios filtro');
          console.log(e);
          this.httpErrorHandler.handle(e);
        });
      }
    }
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
    
    const iddepartamentos: string[] = [];
    const iddistritos: string[] = [];
    const idbarrios: number[] = [];
    
    this.ubicacionesFiltro.forEach((ddb: string)=>{
      if(ddb.includes('dep')) iddepartamentos.push(ddb.split('-')[1]);
      if(ddb.includes('dis')) iddistritos.push(ddb.split('-')[1]);
      if(ddb.includes('bar')) idbarrios.push(Number(ddb.split('-')[1]));
    });
    if(iddepartamentos.length !==0) params['iddepartamento'] = iddepartamentos;
    if(iddistritos.length !== 0) params['iddistrito'] = iddistritos;
    if(idbarrios.length !== 0) params['idbarrio'] = idbarrios;

    console.log(iddepartamentos);
    console.log(iddistritos);
    console.log(idbarrios);
    

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

}
