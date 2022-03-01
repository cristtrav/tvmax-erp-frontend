import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FacturaVenta } from '@dto/factura-venta.dto';
import { ServerResponseList } from '@dto/server-response-list.dto';
import { VentasService } from '@servicios/ventas.service';
import { Extra } from '@util/extra';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';

@Component({
  selector: 'app-vista-ventas',
  templateUrl: './vista-ventas.component.html',
  styleUrls: ['./vista-ventas.component.scss']
})
export class VistaVentasComponent implements OnInit {

  vista: string = 'registros';

  textoBusqueda: string = '';
  cantFiltrosAplicados: number = 0;
  drawerFiltrosVisible: boolean = false; 

  expandSet = new Set<number>();

  paramsFiltros: IParametroFiltro = {};

  constructor(
    private ventasSrv: VentasService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private notif: NzNotificationService,
    private aroute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const v: string | null = this.aroute.snapshot.queryParamMap.get('vista');
    this.cambiarVista(v === null ? 'registros' : v);
  }

  cambiarVista(v: string) {
    this.vista = (v !== 'registros' && v !== 'estadisticas') ? 'registros' : v;
    this.router.navigate([], {
      relativeTo: this.aroute,
      queryParams: { vista: this.vista },
      queryParamsHandling: 'merge'
    });
  }

}
