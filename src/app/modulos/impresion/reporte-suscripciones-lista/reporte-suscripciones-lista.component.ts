import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ServerResponseList } from '@dto/server-response-list.dto';
import { Suscripcion } from '@dto/suscripcion-dto';
import { SuscripcionesService } from '@servicios/suscripciones.service';

@Component({
  selector: 'app-reporte-suscripciones-lista',
  templateUrl: './reporte-suscripciones-lista.component.html',
  styleUrls: ['./reporte-suscripciones-lista.component.scss']
})
export class ReporteSuscripcionesListaComponent implements OnInit {

  @Input()
  lstSuscripciones: Suscripcion[] = [];

  @Input()
  totalRegistros: number = 0;
  @Input()
  totalDeuda: number = 0;

  constructor(
    private suscripcionesSrv: SuscripcionesService,
  ) { }

  ngOnInit(): void {
    //this.cargarSuscripcionesReporte();
  }

  cargarSuscripcionesReporte(){
    let params: HttpParams = new HttpParams();
    params = params.append('eliminado', 'false');
    params = params.append('sort', '+cliente');
    this.suscripcionesSrv.get(params).subscribe((resp: ServerResponseList<Suscripcion>)=>{
      let items: Suscripcion [] = [];
      for(let i=0;i<5;i++){
        items = items.concat(resp.data);
      }
      //this.lstSuscripciones = resp.data; 
      this.lstSuscripciones = items; 
    }, (e)=>{
      console.log('Error al cargar suscripciones para reporte');
      console.log(e);
    });
  }


}
