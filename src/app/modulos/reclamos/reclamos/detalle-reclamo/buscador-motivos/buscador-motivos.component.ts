import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MotivoReclamoDTO } from '@global-dtos/reclamos/motivo-reclamo.dto';
import { MotivosReclamosService } from '@global-services/reclamos/motivos-reclamos.service';
import { Observable, Subscription, debounceTime, finalize, of, tap } from 'rxjs';

@Component({
  selector: 'app-buscador-motivos',
  templateUrl: './buscador-motivos.component.html',
  styleUrls: ['./buscador-motivos.component.scss']
})
export class BuscadorMotivosComponent implements OnInit, OnDestroy {

  @Output()
  motivoSeleccionadoChange = new EventEmitter();

  motivos$: Observable<MotivoReclamoDTO[]> = of([]);
  lstMotivos: MotivoReclamoDTO[] = [];
  loadingMotivos: boolean = false;

  textoBusquedaSusc!: Subscription;
  busquedaCtrl = new FormControl<string>('');

  menuVisible: boolean = false;

  constructor(
    private motivosSrv: MotivosReclamosService
  ){}

  ngOnDestroy(): void {
    this.textoBusquedaSusc.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMotivos();
    this.textoBusquedaSusc =
      this.busquedaCtrl.valueChanges
      .pipe(debounceTime(250))
      .subscribe(() => this.cargarMotivos());
  }

  cargarMotivos(){
    this.motivos$ = this.motivosSrv.get(this.getHttpParams());
  }

  getHttpParams(): HttpParams {
    let params =
      new HttpParams()
      .append('sort', '+descripcion')
      .append('eliminado', false);
      if(this.busquedaCtrl.value) params = params.append('search', this.busquedaCtrl.value)
    return params;
  }

  seleccionarMotivo(motivo: MotivoReclamoDTO){
    this.menuVisible = false;
    this.motivoSeleccionadoChange.emit(motivo);
    setTimeout(() => this.busquedaCtrl.reset(), 350);
  }
}
