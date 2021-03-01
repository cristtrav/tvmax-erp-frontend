import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Departamento } from './../../../dto/departamento-dto';
import { DepartamentosService } from './../../../servicios/departamentos.service';

@Component({
  selector: 'app-vista-departamentos',
  templateUrl: './vista-departamentos.component.html',
  styleUrls: ['./vista-departamentos.component.scss']
})
export class VistaDepartamentosComponent implements OnInit {

  lstDepartamentos: Departamento[] = [];

  constructor(
    private depSrv: DepartamentosService,
    private notif: NzNotificationService
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  private cargarDatos(): void{
    this.depSrv.get().subscribe((data)=>{
      this.lstDepartamentos = data;
    }, (e)=>{
      console.log('Error al cargar departamentos');
      console.log(e);
      this.notif.create('error', 'Error al cargar departamentos', e.error);
    });
  }

  eliminar(id: string | null): void {
    this.depSrv.delete(id).subscribe(()=>{
      this.notif.create('success', 'Eliminado correctamente', '');
      this.cargarDatos();
    }, (e)=>{
      console.log('Error al eliminar departamento');
      console.log(e);
      this.notif.create('error', 'Error al eliminar', e.error);
    });
  }
}