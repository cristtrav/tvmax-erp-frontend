import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ResumenCantSuscDeuda } from '@dto/resumen-cantsusc-deuda-dto';
import { ServerResponseList } from '@dto/server-response-list.dto';
import { SuscripcionesService } from '@servicios/suscripciones.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';

@Component({
  selector: 'app-card-resumen-suscripciones-grupos-servicios',
  templateUrl: './card-resumen-suscripciones-grupos-servicios.component.html',
  styleUrls: ['./card-resumen-suscripciones-grupos-servicios.component.scss']
})
export class CardResumenSuscripcionesGruposServiciosComponent implements OnInit {

  @Input()
  get paramsFiltros(): IParametroFiltro { return this._paramsFiltros };
  set paramsFiltros(p: IParametroFiltro) {
    const oldParams: string = JSON.stringify(this._paramsFiltros);
    this._paramsFiltros = { ...p };
    if (oldParams !== JSON.stringify(p)) this.cargarDatos();;
  };
  private _paramsFiltros: IParametroFiltro = {};

  @Input()
  get textoBusqueda(): string { return this._textoBusqueda };
  set textoBusqueda(t: string) {
    const oldSearch: string = this._textoBusqueda;
    this._textoBusqueda = t;
    if (oldSearch !== t) {
      clearTimeout(this.timerBusqueda);
      this.timerBusqueda = setTimeout(() => {
        this.cargarDatos();
      }, 500);
    }
  }
  private _textoBusqueda: string = '';
  private timerBusqueda: any;

  lstResumenDatos: ResumenCantSuscDeuda[] = [];
  loadingDatos: boolean = false;

  listOfMapData: TreeNodeInterface[] = [
    {
      key: '01',
      referencia: 'Internet',
      cantidad: 10,
      monto: 10000,
      children: [
        {
          key: '01-01',
          referencia: 'Internet 100mb',
          cantidad: 20,
          monto: 30000
        }
      ]
    }
  ];
  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};

  constructor(
    private suscripcionesSrv: SuscripcionesService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
    /*this.listOfMapData.forEach(item => {
      this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
    });*/
  }

  private getHttpQueryParams(): HttpParams {
    let params: HttpParams = new HttpParams().appendAll(this.paramsFiltros);
    params = params.append('eliminado', 'false');
    if (this.textoBusqueda.length !== 0) params = params.append('search', this.textoBusqueda);
    return params;
  }

  cargarDatos() {
    this.loadingDatos = true;
    this.suscripcionesSrv.getResumenGruposServicios(this.getHttpQueryParams()).subscribe((resp: ServerResponseList<ResumenCantSuscDeuda>)=>{
      console.log(resp.data);
      const mapData: TreeNodeInterface[] = [];
      resp.data.forEach((rg: ResumenCantSuscDeuda)=>{
        const nodoGrupo: TreeNodeInterface = {
          key: `gru-${rg.idreferencia}`,
          idreferencia: rg.idreferencia,
          referencia: rg.referencia,
          cantidad: rg.cantidad,
          monto: rg.monto
        };
        if(rg.children){
          nodoGrupo.children = [];
          rg.children.forEach((rs: ResumenCantSuscDeuda)=>{
            nodoGrupo.children?.push({
              key: `ser-${rs.idreferencia}`,
              idreferencia: rs.idreferencia,
              referencia: rs.referencia,
              cantidad: rs.cantidad,
              monto: rs.monto
            });
          });
        }
        mapData.push(nodoGrupo);
      });
      //console.log(mapData);
      this.listOfMapData = mapData;
      this.listOfMapData.forEach(item => {
        this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
      });
      this.loadingDatos = false;      
    }, (e)=>{
      console.log('Error al consultar suscripciones por estado');
      console.log(e);
      this.httpErrorHandler.handle(e);
      this.loadingDatos = false;
    });
  }

  collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
    if (!$event) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.key === d.key)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }

  convertTreeToList(root: TreeNodeInterface): TreeNodeInterface[] {
    const stack: TreeNodeInterface[] = [];
    const array: TreeNodeInterface[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: false });

    while (stack.length !== 0) {
      const node = stack.pop()!;
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level! + 1, expand: false, parent: node });
        }
      }
    }

    return array;
  }

  visitNode(node: TreeNodeInterface, hashMap: { [key: string]: boolean }, array: TreeNodeInterface[]): void {
    if (!hashMap[node.key]) {
      hashMap[node.key] = true;
      array.push(node);
    }
  }

}

interface TreeNodeInterface {
  key: string;
  referencia: string | number | null;
  idreferencia?: number | string | number | null;
  cantidad: number | null;
  monto: number | null;
  level?: number;
  expand?: boolean;
  children?: TreeNodeInterface[];
  parent?: TreeNodeInterface;
}
