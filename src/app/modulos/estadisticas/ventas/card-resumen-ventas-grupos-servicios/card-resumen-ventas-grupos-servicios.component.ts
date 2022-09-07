import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ResumenCantMonto } from '@dto/resumen-cant-monto-dto';
import { ServerResponseList } from '@dto/server-response-list.dto';
import { VentasService } from '@servicios/ventas.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';

@Component({
  selector: 'app-card-resumen-ventas-grupos-servicios',
  templateUrl: './card-resumen-ventas-grupos-servicios.component.html',
  styleUrls: ['./card-resumen-ventas-grupos-servicios.component.scss']
})
export class CardResumenVentasGruposServiciosComponent implements OnInit {

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

  lstResumenDatos: ResumenCantMonto[] = [];
  loadingDatos: boolean = false;

  listOfMapData: TreeNodeInterface[] = [];
  mapOfExpandedData: { [key: string]: TreeNodeInterface[] } = {};
  tituloColumnaMonto: string = 'Total pagado';

  constructor(
    private ventasSrv: VentasService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  private getHttpQueryParams(): HttpParams {
    const p: IParametroFiltro = { ...this.paramsFiltros };
    if (!Object.keys(p).includes('anulado')) p['anulado'] = 'false';
    if (p['anulado'] == 'true') {
      delete p['pagado'];
      this.tituloColumnaMonto = 'Total anulado';
    } else {
      if (!Object.keys(p).includes('pagado')) p['pagado'] = 'true';
      if (p['pagado'] == 'true') this.tituloColumnaMonto = 'Total pagado';
      else this.tituloColumnaMonto = 'Total pendiente';
    }
    let params: HttpParams = new HttpParams().appendAll(p);
    params = params.append('eliminado', 'false');
    if (this.textoBusqueda.length !== 0) params = params.append('search', this.textoBusqueda);
    return params;
  }

  cargarDatos() {
    this.loadingDatos = true;
    this.ventasSrv.getResumenGruposServicios(this.getHttpQueryParams()).subscribe((resp: ServerResponseList<ResumenCantMonto>)=>{
      const mapData: TreeNodeInterface[] = [];
      resp.data.forEach((rg: ResumenCantMonto)=>{
        const nodoGrupo: TreeNodeInterface = {
          key: `gru-${rg.idreferencia}`,
          idreferencia: rg.idreferencia,
          referencia: rg.referencia,
          cantidad: rg.cantidad,
          monto: rg.monto
        };
        if(rg.children){
          nodoGrupo.children = [];
          rg.children.forEach((rs: ResumenCantMonto)=>{
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
      console.log('Error al consultar resumen de ventas por grupos-servicios');
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
