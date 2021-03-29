import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle-suscripcion',
  templateUrl: './detalle-suscripcion.component.html',
  styleUrls: ['./detalle-suscripcion.component.scss']
})
export class DetalleSuscripcionComponent implements OnInit {

  idsuscripcion = 'nueva';

  constructor(
    private aroute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const ids = this.aroute.snapshot.paramMap.get('idsuscripcion');
    if(ids){
      this.idsuscripcion = ids;
    }
  }

}
