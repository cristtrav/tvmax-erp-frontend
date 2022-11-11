import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Barrio } from '@dto/barrio-dto';
import { Departamento } from '@dto/departamento-dto';
import { Distrito } from '@dto/distrito-dto';
import { ServerResponseList } from '@dto/server-response-list.dto';
import { BarriosService } from '@servicios/barrios.service';
import { DepartamentosService } from '@servicios/departamentos.service';
import { DistritosService } from '@servicios/distritos.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { NzFormatEmitEvent, NzTreeNodeOptions } from 'ng-zorro-antd/tree';

@Component({
  selector: 'app-lugar-treeselect',
  templateUrl: './lugar-treeselect.component.html',
  styleUrls: ['./lugar-treeselect.component.scss']
})
export class LugarTreeselectComponent implements OnInit {

  @Output()
  valueChange = new EventEmitter<string[]>();
  @Input()
  value: string[] = [];

  ubicacionesFiltroNodos: NzTreeNodeOptions[] = [];


  constructor(
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private departamentosSrv: DepartamentosService,
    private distritosSrv: DistritosService,
    private barriosSrv: BarriosService
  ) { }

  ngOnInit(): void {
    this.cargarDepartamentosFiltro();
  }

  cargarDepartamentosFiltro() {
    let params: HttpParams = new HttpParams();
    params = params.append('eliminado', 'false');
    params = params.append('sort', '+descripcion');
    this.departamentosSrv.get(params).subscribe((resp: Departamento[]) => {
      const nodes: NzTreeNodeOptions[] = [];
      resp.forEach((d: Departamento) => {
        const node: NzTreeNodeOptions = {
          title: `${d.descripcion}`,
          key: `dep-${d.id}`
        };
        nodes.push(node);
      });
      this.ubicacionesFiltroNodos = nodes;
    }, (e) => {
      console.log('Error al cargar deparatamentos filtro');
      console.log(e);
      this.httpErrorHandler.handle(e);
    });
  }

  cargarNodoCiudadBarrio(ev: NzFormatEmitEvent) {
    const node = ev.node;
    if (node && node.getChildren().length === 0 && node.isExpanded) {
      if (node.key.includes('dep')) {
        let params: HttpParams = new HttpParams();
        params = params.append('eliminado', 'false');
        params = params.append('sort', '+descripcion');
        params = params.append('iddepartamento', node.key.split('-')[1]);
        this.distritosSrv.get(params).subscribe({
          next: (distritos) => {
            const nodesDistrito: NzTreeNodeOptions[] = [];
            distritos.forEach((d: Distrito) => {
              const nodeDistrito: NzTreeNodeOptions = {
                title: `${d.descripcion}`,
                key: `dis-${d.id}`,
                checked: node.isChecked
              };
              nodesDistrito.push(nodeDistrito);
            });
            node.addChildren(nodesDistrito);
          },
          error: (e) => {
            console.error('Error al cargar distritos', e);
            this.httpErrorHandler.process(e);
          }
        });
      } else {
        let params: HttpParams = new HttpParams();
        params = params.append('eliminado', 'false');
        params = params.append('sort', '+descripcion');
        params = params.append('iddistrito', node.key.split('-')[1]);
        this.barriosSrv.get(params).subscribe({
          next: (barrios) => {
            const nodesBarrios: NzTreeNodeOptions[] = [];
            barrios.forEach((b: Barrio) => {
              const nodeBarrio: NzTreeNodeOptions = {
                title: `${b.descripcion}`,
                key: `bar-${b.id}`,
                isLeaf: true,
                checked: node.isChecked
              };
              nodesBarrios.push(nodeBarrio);
            });
            node.addChildren(nodesBarrios);
          },
          error: (e) => {
            console.error('Error al cargar barrios', e);
            this.httpErrorHandler.process(e);
          }
        });
      }
    }
  }

  onValueChange() {
    this.valueChange.emit(this.value);
  }

}
