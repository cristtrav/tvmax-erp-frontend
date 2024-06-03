import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Grupo } from '@dto/grupo-dto';
import { Servicio } from '@dto/servicio-dto';
import { GruposService } from '@services/grupos.service';
import { ServiciosService } from '@services/servicios.service';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { NzFormatEmitEvent, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { NzTreeSelectComponent } from 'ng-zorro-antd/tree-select';

@Component({
  selector: 'app-grupo-servicio-treeselect',
  templateUrl: './grupo-servicio-treeselect.component.html',
  styleUrls: ['./grupo-servicio-treeselect.component.scss']
})
export class GrupoServicioTreeselectComponent implements OnInit {

  @ViewChild(NzTreeSelectComponent)
  private treeSelectGrupoServicio!: NzTreeSelectComponent

  @Output()
  valueChange = new EventEmitter<string[]>();

  @Input()
  value: string[] = [];
  gruposServiciosFiltroNodos: NzTreeNodeOptions[] = [];
  public virtualHeight: string | null = null;

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
    this.gruposSrv.getGrupos(params).subscribe({
      next: (grupos) => {
        const nodes: NzTreeNodeOptions[] = [];
        grupos.forEach((g: Grupo) => {
          const node: NzTreeNodeOptions = {
            title: `${g.descripcion}`,
            key: `gru-${g.id}`,
          }
          nodes.push(node);
          const servSelec: string[] = this.value.filter(gs => gs.includes('ser')).filter(gs => gs.split('-')[2] === `${g.id}`);
          if (servSelec.length !== 0) this.cargarServiciosEnNodo(node);
          this.gruposServiciosFiltroNodos = nodes;
        });
      },
      error: (e) => {
        console.error('Error al cargar grupos', e);
        this.httpErrorHandler.process(e);
      }
    });
  }

  cargarNodoServicio(ev: NzFormatEmitEvent) {
    const node = ev.node;
    if (node && node.getChildren().length === 0 && node.isExpanded) {
      this.cargarServiciosEnNodo(node);
    }
    this.calculateVirtualHeight();
  }

  private cargarServiciosEnNodo(node: NzTreeNodeOptions) {
    let params: HttpParams = new HttpParams();
    params = params.append('eliminado', 'false');
    params = params.append('sort', '+descripcion');
    params = params.append('idgrupo', `${node.key.split('-')[1]}`);
    this.serviciosSrv.getServicios(params).subscribe({
      next: (servicios) => {
        const serviciosNodo: NzTreeNodeOptions[] = [];
        servicios.forEach((s: Servicio) => {
          const datosNodo: NzTreeNodeOptions = {
            title: `${s.descripcion}`,
            key: `ser-${s.id}-${node.key.split('-')[1]}`,
            isLeaf: true,
            checked: node.isChecked
          }
          serviciosNodo.push(datosNodo);
        });
        node.addChildren(serviciosNodo);
        this.calculateVirtualHeight();
      },
      error: (e) => {
        console.log('Error al cargar servicios', e);
        this.httpErrorHandler.process(e);
      }
    });
    
  }

  onValueChange() {
    this.valueChange.emit(this.value);
  }

  calculateVirtualHeight() {
    let cantNodosVisibles: number = this.gruposServiciosFiltroNodos.length;
    for (let treeNode of this.treeSelectGrupoServicio.getExpandedNodeList()) {
      cantNodosVisibles += treeNode.getChildren().length;
    }
    this.virtualHeight = cantNodosVisibles > 11 ? '300px' : null;
  }

}
