import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PremioDTO } from '@dto/premio.dto';
import { PremiosService } from '@servicios/premios.service';
import { SorteosService } from '@servicios/sorteos.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-detalle-premio',
  templateUrl: './detalle-premio.component.html',
  styleUrls: ['./detalle-premio.component.scss']
})
export class DetallePremioComponent implements OnInit {

  idsorteo: string | null = null;
  descripcionSorteo: string = '(sin nombre)'
  idpremio: string = 'nuevo';
  ultimoIdLoading: boolean = false;
  guardando: boolean = false;

  form: FormGroup = new FormGroup({
    id: new FormControl(null, [Validators.required]),
    descripcion: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
    nropremio: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(100)])
  });

  constructor(
    private arotue: ActivatedRoute,
    private router: Router,
    private sorteosSrv: SorteosService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private premiosSrv: PremiosService,
    private notif: NzNotificationService
  ){}

  ngOnInit(): void {
    const tmpIdSorteo = Number(this.arotue.snapshot.paramMap.get('idsorteo'));
    if(!Number.isNaN(tmpIdSorteo)){
      this.idsorteo = `${tmpIdSorteo}`;
      this.cargarSorteo(tmpIdSorteo);
    } else this.router.navigate(['/app', 'sorteos']);

    const tmpIdPremio = Number(this.arotue.snapshot.paramMap.get('idpremio'));
    if(!Number.isNaN(tmpIdPremio)){
      this.idpremio = `${tmpIdPremio}`;
      this.cargarPremio(tmpIdPremio);
    } else this.idpremio = 'nuevo';
  }

  cargarSorteo(idsorteo: number){
    this.sorteosSrv.getPorId(idsorteo)
    .subscribe({
      next: (sorteo) => {
        this.descripcionSorteo = sorteo.descripcion;
      },
      error: (e) => {
        console.error('Error al cargar sorteo por id', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

  cargarPremio(idpremio: number){
    this.premiosSrv.getPremioPorId(idpremio).subscribe({
      next: (premio) => {
        this.form.controls.id.setValue(premio.id);
        this.form.controls.descripcion.setValue(premio.descripcion);
        this.form.controls.nropremio.setValue(premio.nropremio);
      },
      error: (e) => {
        console.error('Error al cargar premio por id', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

  generarId(){
    this.ultimoIdLoading = true;
    this.premiosSrv.getUltimoId()
      .pipe(finalize(() => this.ultimoIdLoading = false))
      .subscribe({
        next: (ultimoid) => {
          
          this.form.controls.id.setValue(!ultimoid ? 10 : Number(ultimoid) + 1);
        },
        error: (e) => {
          console.error('Error al cargar ultimo id de premios', e);
          this.httpErrorHandler.process(e);
        }
      })
  }
  
  guardar(){
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsDirty();
      this.form.get(key)?.updateValueAndValidity();
    })
    if(this.form.valid && this.idpremio == 'nuevo') this.registrar();
    if(this.form.valid && this.idpremio != 'nuevo') this.editar();
  }

  private registrar(){
    this.guardando = true;
    this.premiosSrv.post(this.getDto())
      .pipe(finalize(() => this.guardando = false))
      .subscribe({
        next: () => {
          this.notif.success('<strong>Éxito</strong>', 'Premio registrado correctamente.');
          this.form.reset();
        },
        error: (e) => {
          console.error('Error al registrar premio', e);
          this.httpErrorHandler.process(e);
        }
      })
  }

  private editar(){
    this.guardando = true;
    this.premiosSrv.put(Number(this.idpremio), this.getDto())
      .pipe(finalize(() => this.guardando = false))
      .subscribe({
        next: () => {
          this.notif.success('<strong>Éxito</strong>', 'Premio editado correctamente.');
        },
        error: (e) =>{
          console.error('Error al editar premio', e);
          this.httpErrorHandler.process(e);
        }
      })
  }

  getDto(): PremioDTO{
    return {
      id: this.form.controls.id.value,
      descripcion: this.form.controls.descripcion.value,
      idsorteo: Number(this.idsorteo),
      nropremio: this.form.controls.nropremio.value,
      eliminado: false
    }
  }

}
