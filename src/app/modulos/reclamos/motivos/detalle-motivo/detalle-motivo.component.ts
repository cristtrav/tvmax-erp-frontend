import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MotivoReclamoDTO } from '@global-dtos/reclamos/motivo-reclamo.dto';
import { MotivosReclamosService } from '@global-services/reclamos/motivos-reclamos.service';
import { ResponsiveUtils } from '@global-utils/responsive/responsive-utils';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { EMPTY, Observable, Subscription, finalize, of, tap } from 'rxjs';

@Component({
  selector: 'app-detalle-motivo',
  templateUrl: './detalle-motivo.component.html',
  styleUrls: ['./detalle-motivo.component.scss']
})
export class DetalleMotivoComponent implements OnInit {

  idmotivo: string = 'nuevo'
  readonly formLabelSizes = ResponsiveUtils.DEFAULT_FORM_LABEL_SIZES;
  readonly formControlSizes = ResponsiveUtils.DEFALUT_FORM_CONTROL_SIZES;
  readonly formSizes = ResponsiveUtils.DEFAUT_FORM_SIZES;
  readonly formSaveSize = ResponsiveUtils.DEFAULT_FORM_ACTIONS_SIZES;

  guardando: boolean = false;
  cargandoMotivo: boolean = false;
  generandoId: boolean = false;

  form: FormGroup = new FormGroup({
    id: new FormControl(null, [Validators.required]),
    descripcion: new FormControl(null, [Validators.required, Validators.maxLength(80)])
  })

  constructor(
    private aroute: ActivatedRoute,
    private router: Router,
    private motivosSrv: MotivosReclamosService,
    private notif: NzNotificationService
  ){}

  ngOnInit(): void {
    const idMotivoStr = this.aroute.snapshot.paramMap.get('idmotivo');
    this.idmotivo = Number.isInteger(Number(idMotivoStr)) ? `${idMotivoStr}` : 'nuevo';
    if(this.idmotivo != 'nuevo') this.cargarDatos(Number(this.idmotivo));
  }

  guardar(){
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsDirty();
      this.form.get(key)?.updateValueAndValidity();
    });
    if(this.form.valid)
      if(this.idmotivo == 'nuevo') this.registrar();
      else this.editar();
    
  }

  private registrar(){
    this.guardando = true;
    this.motivosSrv
      .post(this.getDto())
      .pipe(finalize(() => this.guardando = false))
      .subscribe(() => {
        this.notif.success('<strong>Éxito</strong>', 'Motivo de reclamo registrado.');
        this.form.reset();
      });
  }

  private editar(){
    this.guardando = true;
    this.motivosSrv
      .put(Number(this.idmotivo), this.getDto())
      .pipe(finalize(() => this.guardando = false))
      .subscribe(() => {
        this.notif.success('<strong>Éxito</strong>', 'Motivo de reclamo editado.');
        this.router.navigate([this.getDto().id], { relativeTo: this.aroute.parent });
        this.idmotivo = `${this.getDto().id}`;
      });
  }

  cargarDatos(idmotivo: number){
    this.cargandoMotivo = true;
    this.motivosSrv
      .getPorId(idmotivo)
      .pipe(finalize(() => this.cargandoMotivo = false))
      .subscribe((motivo) => {
        this.form.controls.id.setValue(motivo.id);
        this.form.controls.descripcion.setValue(motivo.descripcion);
      });
  }

  getDto(): MotivoReclamoDTO{
    return {
      id: this.form.controls.id.value,
      descripcion: this.form.controls.descripcion.value,
      eliminado: false
    }
  }

  limpiar(){
    this.idmotivo = 'nuevo';
    this.router.navigate(['nuevo'], {relativeTo: this.aroute.parent});
    this.form.reset();
  }

  generarId(){
    this.generandoId = true;
    this.motivosSrv
      .getLastId()
      .pipe(finalize(() => this.generandoId = false))
      .subscribe((lastid) => this.form.controls.id.setValue(lastid == 0 || lastid == null ? 10 : lastid + 1));
  }

}
