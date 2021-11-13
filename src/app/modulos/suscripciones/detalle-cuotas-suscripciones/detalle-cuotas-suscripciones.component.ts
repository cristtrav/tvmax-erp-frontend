import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle-cuotas-suscripciones',
  templateUrl: './detalle-cuotas-suscripciones.component.html',
  styleUrls: ['./detalle-cuotas-suscripciones.component.scss']
})
export class DetalleCuotasSuscripcionesComponent implements OnInit {

  idsuscripcion: number | null = null;
  idcuota: string = 'nueva';

  constructor(
    private aroute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const idsus = this.aroute.snapshot.paramMap.get('idsuscripcion');
    const idcuo = this.aroute.snapshot.paramMap.get('idcuota');
    if(idsus){
      this.idsuscripcion = +idsus;
    }
    if(idcuo){
      this.idcuota = idcuo;
    }
  }

}
