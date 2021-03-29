import { Component, Input, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { Suscripcion } from './../../../dto/suscripcion-dto';
import { SuscripcionesService } from './../../../servicios/suscripciones.service';

@Component({
  selector: 'app-contenido-vista-suscripciones',
  templateUrl: './contenido-vista-suscripciones.component.html',
  styleUrls: ['./contenido-vista-suscripciones.component.scss']
})
export class ContenidoVistaSuscripcionesComponent implements OnInit {

  @Input()
  idcliente: number | null = null;
  @Input()
  mostrarCliente: boolean = false;

  lstSuscripciones: Suscripcion[] = [];
  tableLoading: boolean = false;
  pageIndex: number = 1;
  pageSize: number = 10;
  total: number = 20;

  expandSet = new Set<number>();
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  constructor(
    private suscripSrv: SuscripcionesService,
    private notif: NzNotificationService
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarTotal(): void{
    this.suscripSrv.getTotal(this.getFiltros()).subscribe((data)=>{
      this.total = data.total;
    }, (e)=>{
      console.log('Error al contar suscripciones');
      console.log(e)
      this.notif.create('error', 'Error al obtener cuenta de total de suscripciones', e.error);
    });
  }

  private getFiltros(): IFilter[] {
    let filt: IFilter[] = [];
    if(this.idcliente){
      filt.push({key: 'idcliente', value: `${this.idcliente}`});
    }
    filt.push({key: 'eliminado', value: 'false'});
    filt.push({key: 'offset', value: `${(this.pageIndex-1)*this.pageSize}`});
    filt.push({key: 'limit', value: `${this.pageSize}`});
    filt.push({key: 'sort', value: '+cliente'});
    return filt;
  }

  private cargarDatos(): void{
    this.tableLoading = true;
    
    this.suscripSrv.get(this.getFiltros()).subscribe((data)=>{
      this.lstSuscripciones = data;
      this.tableLoading = false;
    }, (e)=>{
      console.log('Error al cargar suscripciones');
      console.log(e);
      this.notif.create('error', 'Error al cargar suscripciones', e.error);
      this.tableLoading = false;
    });
    this.cargarTotal();
  }

  eliminar(id: number | null): void {
    if(id){
      this.suscripSrv.delete(id).subscribe(()=>{
        this.notif.create('success', 'Suscripción eliminada correctamente', '');
        this.cargarDatos();
      }, (e)=>{
        console.log('Error al eliminar suscripcion');
        console.log(e);
        this.notif.create('error', 'Error al eliminar suscripción', e.error);
      });
    }
  }

  onTableParamsChange(params: NzTableQueryParams){
    /*console.log(params);
    console.log('El tamaño de la pagina es: '+this.pageSize);*/
    this.cargarDatos();
  }

}

interface IFilter{
  key: string,
  value: string
}
