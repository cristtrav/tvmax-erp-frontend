import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Grupo } from '@dto/grupo-dto';
import { ServerResponseList } from '@dto/server-response-list.dto';
import { Servicio } from '@dto/servicio-dto';
import { GruposService } from '@servicios/grupos.service';
import { ServiciosService } from '@servicios/servicios.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { NzFormatEmitEvent, NzTreeNode, NzTreeNodeOptions } from 'ng-zorro-antd/tree';

@Component({
  selector: 'app-grupo-servicio-treeselect',
  templateUrl: './grupo-servicio-treeselect.component.html',
  styleUrls: ['./grupo-servicio-treeselect.component.scss']
})
export class GrupoServicioTreeselectComponent implements OnInit {

  @Output()
  valueChange = new EventEmitter<string[]>();

  @Input()
  value: string[] = [];
  gruposServiciosFiltroNodos: NzTreeNodeOptions[] = [];

  constructor(
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private gruposSrv: GruposService,
    private serviciosSrv: ServiciosService,
  ) { }

  ngOnInit(): void {
    this.cargarGruposFiltro();
  }

  async cargarGruposFiltro() {
    let params: HttpParams = new HttpParams();
    params = params.append('eliminado', false);
    params = params.append('sort', '+descripcion');
    this.gruposSrv.getGrupos(params).subscribe((resp: ServerResponseList<Grupo>) => {
      const nodes: NzTreeNodeOptions[] = [];
      resp.data.forEach((g: Grupo) => {
        const node: NzTreeNodeOptions = {
          title: `${g.descripcion}`,
          key: `gru-${g.id}`,
        }
        nodes.push(node);
        const servSelec: string[] = this.value.filter(gs => gs.includes('ser')).filter(gs => gs.split('-')[2] === `${g.id}`);
        if(servSelec.length !== 0) this.cargarServiciosEnNodo(node);
        this.gruposServiciosFiltroNodos = nodes;
      });
    }, (e) => {
      console.log('Error al cargar grupos filtro');
      console.log(e);
      this.httpErrorHandler.handle(e);
    });
  }

  cargarNodoServicio(ev: NzFormatEmitEvent) {
    const node = ev.node;
    if (node && node.getChildren().length === 0 && node.isExpanded) {
      this.cargarServiciosEnNodo(node);
    }
  }

  private cargarServiciosEnNodo(node: NzTreeNodeOptions) {
    let params: HttpParams = new HttpParams();
    params = params.append('eliminado', 'false');
    params = params.append('sort', '+descripcion');
    params = params.append('idgrupo', `${node.key.split('-')[1]}`);
    this.serviciosSrv.getServicios(params).subscribe((resp: ServerResponseList<Servicio>) => {
      const serviciosNodo: NzTreeNodeOptions[] = [];
      resp.data.forEach((s: Servicio) => {
        const datosNodo: NzTreeNodeOptions = {
          title: `${s.descripcion}`,
          key: `ser-${s.id}-${node.key.split('-')[1]}`,
          isLeaf: true,
          checked: node.isChecked
        }
        serviciosNodo.push(datosNodo);
      });
      node.addChildren(serviciosNodo);
    }, (e) => {
      console.log('Error al cargar servicios del nodo');
      console.log(e);
      this.httpErrorHandler.handle(e);
    });
  }

  onValueChange() {
    this.valueChange.emit(this.value);
  }

}
