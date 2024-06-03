import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PremioDTO } from '@dto/premio.dto';
import { PremiosService } from '@global-services/premios.service';
import { SorteosService } from '@global-services/sorteos.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-ganadores',
  templateUrl: './ganadores.component.html',
  styleUrls: ['./ganadores.component.scss']
})
export class GanadoresComponent implements OnInit {

  idsorteo: number = -1;
  loadingSorteo: boolean = false;
  sorteo: string = ''
  lstPremios: PremioDTO[] = [];
  loadingPremios: boolean = false;

  constructor(
    private sorteosSrv: SorteosService,
    private aroute: ActivatedRoute,
    private router: Router,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private premiosSrv: PremiosService
  ){}

  ngOnInit(): void {
    const tmpIdSorteo = Number(this.aroute.snapshot.paramMap.get('idsorteo'));
    if(!Number.isNaN(tmpIdSorteo)){
      this.idsorteo = tmpIdSorteo;
      this.cargarSorteo(tmpIdSorteo);
      this.cargarPremios(tmpIdSorteo);
    } else this.router.navigate(['/app', 'sorteos']);
  }

  cargarSorteo(idsorteo: number){
    this.sorteosSrv.getPorId(idsorteo).subscribe({
      next: (sorteo) => {
        this.sorteo = sorteo.descripcion;
      },
      error: (e) => {
        console.error('Error al cargar sorteo por id', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

  cargarPremios(idsorteo: number){
    const params = new HttpParams()
    .append('eliminado', 'false')
    .append('sort', '+nropremio');
    this.loadingPremios = true;
    this.premiosSrv.getPremiosPorSorteo(idsorteo, params)
    .pipe(finalize(() => this.loadingPremios = false))
    .subscribe({
      next: (premios) => {
        this.lstPremios = premios;
      },
      error: (e) => {
        console.error('Error al cargar premios', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

}
