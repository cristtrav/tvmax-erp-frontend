import { Component, OnInit } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Cobrador } from './../../../dto/cobrador-dto';
import { CobradoresService } from './../../../servicios/cobradores.service';

@Component({
  selector: 'app-vista-cobradores',
  templateUrl: './vista-cobradores.component.html',
  styleUrls: ['./vista-cobradores.component.scss']
})
export class VistaCobradoresComponent implements OnInit {

  lstCobradores: Cobrador[] = [];

  constructor(
    private cobradoresSrv: CobradoresService,
    private notif: NzNotificationService
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cobradoresSrv.get().subscribe((data)=>{
      this.lstCobradores = data;
    }, (e)=>{
      console.log('Error al cargar cobradores');
      console.log(e);
      this.notif.create('error', 'Error al cargar cobradores', e.error);
    });
  }

  eliminar(id: number | null): void {
    if(id !== null){
      this.cobradoresSrv.delete(id).subscribe(()=>{
        this.notif.create('success', 'Eliminado correctamente', '');
        this.cargarDatos();
      }, (e)=>{
        console.log('Error al eliminar cobrador');
        console.log(e);
        this.notif.create('error', 'Error al eliminar', e.error);
      });
    }
  }

}
