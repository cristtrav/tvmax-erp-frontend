import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle-domicilio',
  templateUrl: './detalle-domicilio.component.html',
  styleUrls: ['./detalle-domicilio.component.scss']
})
export class DetalleDomicilioComponent implements OnInit {

  @Input()
  iddomicilio: string = 'nuevo';

  constructor(
    private aroute: ActivatedRoute
  ){ }

  ngOnInit(): void {
    const param = this.aroute.snapshot.paramMap.get('iddomicilio');
    this.iddomicilio = param != null ? param : 'nuevo';
  }

}
