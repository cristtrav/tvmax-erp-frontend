import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResponsiveSizes } from '@global-utils/responsive/responsive-sizes.interface';

@Component({
  selector: 'app-detalle-suscripcion',
  templateUrl: './detalle-suscripcion.component.html',
  styleUrls: ['./detalle-suscripcion.component.scss']
})
export class DetalleSuscripcionComponent implements OnInit {

  readonly FORM_SIZES: ResponsiveSizes = { xs: 24, sm: 22, md: 20, lg: 18, xl: 16, xxl: 14 } as const;

  idsuscripcion = 'nueva';

  constructor(
    private aroute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const ids = this.aroute.snapshot.paramMap.get('idsuscripcion');
    if(ids) this.idsuscripcion = ids;
  }

}
