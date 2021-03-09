import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Cliente } from './../../../dto/cliente-dto';
import { ClientesService } from './../../../servicios/clientes.service';

@Component({
  selector: 'app-vista-clientes',
  templateUrl: './vista-clientes.component.html',
  styleUrls: ['./vista-clientes.component.scss']
})
export class VistaClientesComponent implements OnInit {

  lstClientes: Cliente[] = [];
  total: number = 0;
  pageSize: number = 10;
  pageIndex: number = 1;
  tablaLoading = false;
  expandSet = new Set<number>();

  constructor(
    private cliSrv: ClientesService,
    private notif: NzNotificationService
  ) { }

  ngOnInit(): void {
    this.cargarDatos(this.pageIndex, this.pageSize);
  }

  cargarDatos(pageIndex:number, pageSize: number): void {
    this.tablaLoading = true;
    this.cliSrv.getTotal().subscribe((data) => {
      this.total = data.total;
      this.cliSrv.get(pageIndex, pageSize).subscribe((data) => {
        this.lstClientes = data;
        this.tablaLoading = false
      }, (e) => {
        console.log('Error al cargar clientes');
        console.log(e);
        this.notif.create('error', 'Error al cargar clientes', e.error);
      });
    }, (e) => {
      console.log('Error al consultar total');
      console.log(e);
      this.tablaLoading = false;
    });
  }

  eliminar(id: number | null): void {
    if (id !== null) {
      this.cliSrv.delete(id).subscribe(() => {
        this.notif.create('success', 'Eliminado correctamente', '');
        this.cargarDatos(this.pageIndex, this.pageSize);
      }, (e) => {
        console.log('Error al eliminar cliente');
        console.log(e);
        this.notif.create('error', 'Error al eliminar', e.error);
      });
    }
  }

  onTableParamsChange(params: NzTableQueryParams): void{
    const {pageIndex, pageSize} = params;
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.cargarDatos(pageIndex, pageSize);
  }

  onRowExpand(id: number, checked: boolean): void{
    if(checked){
      this.expandSet.add(id);
    }else{
      this.expandSet.delete(id);
    }
  }

}
