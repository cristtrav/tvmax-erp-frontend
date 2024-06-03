import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ParticipanteSorteoDTO } from '@dto/participante-sorteo.dto';
import { SorteosService } from '@services/sorteos.service';
import { Extra } from '@global-utils/extra';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { finalize, forkJoin } from 'rxjs';

@Component({
  selector: 'app-participantes',
  templateUrl: './participantes.component.html',
  styleUrls: ['./participantes.component.scss']
})
export class ParticipantesComponent implements OnInit {

  idsorteo: string | null = null;
  sorteo: string = '(sin nombre)';
  isModalAgregarVisible: boolean = false;
  agregandoParticipantes: boolean = false;
  loadingParticipantes: boolean = false;
  totalRegisters: number = 0;
  sortStr: string | null = null;
  pageSize: number = 10;
  pageIndex: number = 1;
  lstParticipantes: ParticipanteSorteoDTO[] = [];
  textoBusqueda: string = '';
  timerBusqueda: any;

  form: FormGroup = new FormGroup({
    suscritoshasta: new FormControl(null, [Validators.required]),
    aldiahasta: new FormControl(null, [Validators.required])
  });

  constructor(
    private aroute: ActivatedRoute,
    private router: Router,
    private modal: NzModalService,
    private sorteosSrv: SorteosService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private notif: NzNotificationService
  ){}

  ngOnInit(): void {
    const tmpIdsorteo = Number(this.aroute.snapshot.paramMap.get('idsorteo'));
    if(!Number.isNaN(tmpIdsorteo)){
      this.idsorteo = `${tmpIdsorteo}`;
      this.cargarSorteo(tmpIdsorteo);
    }else this.router.navigate(['/app', 'sorteos']);

    const dateConectados = new Date();
    dateConectados.setMonth(dateConectados.getMonth() - 5);
    dateConectados.setDate(0);

    const alDiaHasta = new Date();
    alDiaHasta.setMonth(alDiaHasta.getMonth() + 1);
    alDiaHasta.setDate(0);
    
    this.form.controls.suscritoshasta.setValue(dateConectados);
    this.form.controls.aldiahasta.setValue(alDiaHasta);

    //this.cargarDatos();
  }

  cargarSorteo(idsorteo: number){
    this.sorteosSrv.getPorId(idsorteo).subscribe({
      next: (sorteo) => {
        this.sorteo = sorteo.descripcion;
      },
      error: (e) => {
        console.error(`Error al cargar sorteo por ID`, e)
        this.httpErrorHandler.process(e);
      }
    })
  }

  cargarDatos(){
    this.loadingParticipantes = true;
    forkJoin({
      participantes: this.sorteosSrv.getParticipantes(Number(this.idsorteo), this.getHttpParams()),
      total: this.sorteosSrv.getTotalParticipantes(Number(this.idsorteo), this.getHttpParams())
    })
    .pipe(finalize(() => this.loadingParticipantes = false))
    .subscribe({
      next: (resp) => {
        this.lstParticipantes = resp.participantes;
        this.totalRegisters = resp.total;
      },
      error: (e) => {
        console.error('Error al cargar participantes', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

  agregarParticipantes(){
    this.agregandoParticipantes = true;
    this.sorteosSrv.agregarParticipantes(this.getDtoCriterios(), Number(this.idsorteo))
    .pipe(finalize(() => this.agregandoParticipantes = false))
    .subscribe({
      next: () => {
        console.log('agregado');
        this.isModalAgregarVisible = false;
        this.cargarDatos();
      },
      error: (e) => {
        console.error('Error al agregar participantes', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

  getDtoCriterios(): CriteriosSorteoType {
    return {
      suscritoshasta: this.form.controls.suscritoshasta.value.toISOString(),
      aldiahasta: this.form.controls.aldiahasta.value.toISOString()
    }
  }

  getHttpParams(): HttpParams{
    let params = new HttpParams().append('eliminado', 'false');
    params = params.append('limit', this.pageSize);
    params = params.append('offset', (this.pageIndex -1) * this.pageSize);
    if(this.sortStr) params = params.append('sort', this.sortStr);
    if(this.textoBusqueda) params = params.append('search', this.textoBusqueda);
    return params;
  }

  onTableQueryParamsChange(tableParams: NzTableQueryParams){
    this.pageSize = tableParams.pageSize;
    this.pageIndex = tableParams.pageIndex;
    this.sortStr = Extra.buildSortString(tableParams.sort);
    this.cargarDatos();
  }

  confirmarEliminacion(participante: ParticipanteSorteoDTO){
    this.modal.confirm({
      nzTitle: '¿Desea eliminar el participante?',
      nzContent: `${participante.idcliente} - ${participante.cliente}`,
      nzOkDanger: true,
      nzOkText: 'Eliminar',
      nzOnOk: () => this.eliminar(participante.idsorteo, participante.idcliente)
    })
  }

  eliminar(idsorteo: number, idcliente: number){
    this.sorteosSrv.deleteParticipante(idsorteo, idcliente).subscribe({
      next: () => {
        this.notif.success('<strong>Éxito</strong>', 'Participante eliminado correctamente.');
        this.cargarDatos()
      },
      error: (e) => {
        console.error('Error al eliminar participante', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

  buscar(){
    clearTimeout(this.timerBusqueda);
    this.timerBusqueda = setTimeout(() => {
      this.cargarDatos();
    }, 300);
  }

  limpiarBusqueda(){
    this.textoBusqueda = '';
    clearTimeout(this.timerBusqueda);
    this.timerBusqueda = setTimeout(() => {
      this.cargarDatos();
    }, 300);
  }
}

type CriteriosSorteoType = {
  suscritoshasta: string;
  aldiahasta: string;
}
