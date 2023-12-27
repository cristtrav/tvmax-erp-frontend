import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SorteoDTO } from '@dto/sorteo.dto';
import { SorteosService } from '@servicios/sorteos.service';
import { HttpErrorResponseHandlerService } from '@util/http-error-response-handler.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-detalle-sorteo',
  templateUrl: './detalle-sorteo.component.html',
  styleUrls: ['./detalle-sorteo.component.scss']
})
export class DetalleSorteoComponent implements OnInit {

  idsorteo: string = 'nuevo';

  guardarLoading: boolean = false;
  ultimoIdLoading: boolean = false;

  form: FormGroup = new FormGroup({
    id: new FormControl(null, [Validators.required]),
    descripcion: new FormControl(null, [Validators.required, Validators.maxLength(70)])
  })
  
  constructor(
    private sorteosSrv: SorteosService,
    private notif: NzNotificationService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private aroute: ActivatedRoute,
    private router: Router
  ){}

  ngOnInit(): void {
    const idTmp = Number(this.aroute.snapshot.paramMap.get('idsorteo'));
    this.idsorteo = !Number.isNaN(idTmp) ? `${idTmp}` : 'nuevo';
    if(!Number.isNaN(idTmp)) this.cargarDatos(idTmp);
  }

  cargarDatos(id: number){
    this.sorteosSrv.getPorId(id).subscribe({
      next: (sorteo) => {
        this.form.controls.id.setValue(sorteo.id);
        this.form.controls.descripcion.setValue(sorteo.descripcion);
      },
      error: (e) => {
        console.error('Error al cargar sorteo por id', e);
        this.httpErrorHandler.process(e);
      }
    })
  }
  
  guardar(){
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsDirty();
      this.form.get(key)?.updateValueAndValidity();
    });
    if(this.form.valid && this.idsorteo == 'nuevo') this.registrar();
    if(this.form.valid && this.idsorteo != 'nuevo') this.editar();
  }

  private registrar(){
    this.guardarLoading = true;
    this.sorteosSrv
      .post(this.getDTO())
      .pipe(finalize(() => this.guardarLoading = false))
      .subscribe({
        next: () => {
          const idsorteo = this.form.controls.id.value;
          this.notif.create('success', `<strong>Éxito</strong>`, 'Sorteo registrado.');
          this.router.navigate([idsorteo], { relativeTo: this.aroute.parent });
          this.idsorteo = `${idsorteo}`;
        },
        error: (e) => {
          console.error('Error al registrar sorteo', e);
          this.httpErrorHandler.process(e);
        }
      });
  }
  
  private editar(){
    this.guardarLoading = false;
    this.sorteosSrv.put(Number(this.idsorteo), this.getDTO())
      .pipe(finalize(() => this.guardarLoading = false))
      .subscribe({
        next: () => {
          this.notif.success(`<strong>Éxito</strong>`, 'Sorteo editado correctamente.');
        },
        error: (e) => {
          console.error('Error al editar sorteo', e);
          this.httpErrorHandler.process(e);
        }
      })
  }

  cargarUltimoId(){
    this.ultimoIdLoading = true;
    this.sorteosSrv
      .getLastId()
      .pipe(finalize(() => this.ultimoIdLoading = false))
      .subscribe({
        next: (id) => this.form.controls.id.setValue(Number(id) + 1),
        error: (e) => {
          console.error('Error al cargar ultimo Id de sorteo', e);
          this.httpErrorHandler.process(e);
        }
      });
  }

  private getDTO(): SorteoDTO{
    return {
      id: this.form.controls.id.value,
      descripcion: this.form.controls.descripcion.value,
      eliminado: false
    }
  }

}
