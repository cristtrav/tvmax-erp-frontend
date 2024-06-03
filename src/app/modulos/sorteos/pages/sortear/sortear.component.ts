import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from '@dto/cliente-dto';
import { ParticipanteSorteoDTO } from '@dto/participante-sorteo.dto';
import { PremioDTO } from '@dto/premio.dto';
import { ClientesService } from '@global-services/clientes.service';
import { PremiosService } from '@global-services/premios.service';
import { SorteosService } from '@global-services/sorteos.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-sortear',
  templateUrl: './sortear.component.html',
  styleUrls: ['./sortear.component.scss']
})
export class SortearComponent implements OnInit {

  idsorteo: number = -1;
  sorteo: string = '';
  loadingSorteo: boolean = false;
  lstParticipantes: ParticipanteSorteoDTO[] = [];
  loadingPremios: boolean = false;
  lstPremios: PremioDTO[] = [];
  premioSeleccionado: PremioDTO | null = null;
  intervalSorteo: any;
  codClienteActual: number = 0;
  clienteActual: Cliente | null = null;
  sorteoEnProceso: boolean = false;

  constructor(
    private sorteosSrv: SorteosService,
    private premiosSrv: PremiosService,
    private aroute: ActivatedRoute,
    private router: Router,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private notif: NzNotificationService,
    private clientesSrv: ClientesService
  ){}

  ngOnInit(): void {
    const tmpIdsorteo = Number(this.aroute.snapshot.paramMap.get('idsorteo'));
    if(!Number.isNaN(tmpIdsorteo)){
      this.idsorteo = tmpIdsorteo;
      this.cargarSorteo(tmpIdsorteo);
      this.cargarPremios(tmpIdsorteo);
      this.cargarParticipantes(tmpIdsorteo);
    } else this.router.navigate(['/app', 'sorteos']);
  }

  cambioDePremio(){
    this.clienteActual = null;
    this.codClienteActual = 0;
  }

  cargarSorteo(idsorteo: number){
    this.loadingSorteo = true;
    this.sorteosSrv.getPorId(idsorteo)
    .pipe((finalize(() => this.loadingSorteo = false)))
    .subscribe({
      next: (sorteo) => {
        this.sorteo = sorteo.descripcion;
      },
      error: (e) => {
        console.error('Error al cargar sorteo por id', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

  private cargarParticipantes(idsorteo: number){
    this.sorteosSrv.getParticipantes(idsorteo).subscribe({
      next: (participantes) => {
        this.lstParticipantes = participantes;
        this.eliminarParticipantesGanadores();
      },
      error: (e) => {
        console.error('Error al cargar participantes', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

  private cargarPremios(idsorteo: number){
    const params = new HttpParams()
    .append('eliminado', 'false')
    .append('sort', '-nropremio');

    this.loadingPremios = true;
    this.premiosSrv.getPremiosPorSorteo(idsorteo, params)
    .pipe(finalize(() => this.loadingPremios = false))
    .subscribe({
      next: (premios) => {
        this.lstPremios = premios;
        this.eliminarParticipantesGanadores();
      },
      error: (e) => {
        console.error('Error al cargar premios');
        this.httpErrorHandler.process(e);
      }
    })
  }

  private eliminarParticipantesGanadores(){
    if(this.lstParticipantes.length > 0 && this.lstPremios.length > 0)
      this.lstParticipantes = this.lstParticipantes.filter(par => !(this.lstPremios.find(p => p.idclienteganador == par.idcliente)));
  }

  cargarCliente(idcliente: number){
    this.clientesSrv.getPorId(idcliente).subscribe({
      next: (cliente) => {
        this.clienteActual = cliente;
      },
      error: (e) => {
        console.error('Error al cargar cliente por id', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

  private editarPremio(premio: PremioDTO){
    this.premiosSrv.put(premio.id, premio).subscribe({
      error: (e) => {
        console.error('Error al guardar ganador', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

  iniciarSorteo(){
    if(!this.premioSeleccionado){
      this.notif.warning('Seleccione un premio','');
      return;
    }
    if(this.lstParticipantes.length == 0){
      this.notif.error('No hay participantes', '');
      return;
    }
    this.clienteActual = null;
    this.sorteoEnProceso = true;
    this.intervalSorteo = setInterval(() => {
      this.codClienteActual = this.lstParticipantes[this.getRndIndex(this.lstParticipantes.length)].idcliente
    }, 25)
  }

  detenerSorteo(){
    this.sorteoEnProceso = false;
    clearInterval(this.intervalSorteo);
    if(this.premioSeleccionado?.idclienteganador)
    this.codClienteActual = this.premioSeleccionado.idclienteganador;
    this.cargarCliente(this.codClienteActual);
    const idx = this.lstPremios.findIndex(pre => pre.id == this.premioSeleccionado?.idclienteganador);
    if(idx != -1) this.lstPremios[idx].idclienteganador = this.codClienteActual;
    if(this.premioSeleccionado){
      this.premioSeleccionado.idclienteganador = this.codClienteActual;
      this.editarPremio(this.premioSeleccionado)
    }
    this.eliminarParticipantesGanadores();
  }

  cancelarSorteo(){
    clearInterval(this.intervalSorteo);
    this.sorteoEnProceso = false;
    this.codClienteActual = 0;
    this.clienteActual = null;
  }

  private getRndIndex(arrLength: number): number{
    const min = 0;
    const max = arrLength - 1;
    return Math.floor(Math.random() * (max - min)) + min;
  }

}
