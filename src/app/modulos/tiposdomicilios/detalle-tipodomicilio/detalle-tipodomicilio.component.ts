import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { TipoDomicilio } from './../../../dto/tipodomicilio-dto';
import { TiposdomiciliosService } from './../../../servicios/tiposdomicilios.service';
import { HttpErrorResponseHandlerService } from '../../../util/http-error-response-handler.service';

@Component({
  selector: 'app-detalle-tipodomicilio',
  templateUrl: './detalle-tipodomicilio.component.html',
  styleUrls: ['./detalle-tipodomicilio.component.scss']
})
export class DetalleTipodomicilioComponent implements OnInit {

  idtipodomicilio = 'nuevo';
  form: FormGroup = this.fb.group({
    id: [null, [Validators.required]],
    descripcion: [null, [Validators.required, Validators.maxLength(60)]]
  });
  guardarLoading: boolean = false;
  formLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private aroute: ActivatedRoute,
    private router: Router,
    private tipoDomSrv: TiposdomiciliosService,
    private notif: NzNotificationService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    const id = this.aroute.snapshot.paramMap.get('id');
    if(id!==null){
      this.idtipodomicilio = id;
      if(this.idtipodomicilio !== 'nuevo'){
        this.cargarDatos();
      }
    }
  }

  private cargarDatos(): void{
    this.formLoading = true;
    this.tipoDomSrv.getPorId(+this.idtipodomicilio).subscribe((data)=>{
      this.form.get('id')?.setValue(data.id);
      this.form.get('descripcion')?.setValue(data.descripcion);
      this.formLoading = false;
    }, (e)=>{
      console.log('Error al cargar datos del tipo de domicilio');
      console.log(e);
      this.httpErrorHandler.handle(e);
      //this.notif.create('error', 'Error al cargar datos', e.error);
      this.formLoading = false;
    });
  }

  private getDto(): TipoDomicilio {
    const td: TipoDomicilio = new TipoDomicilio();
    td.id = this.form.get('id')?.value;
    td.descripcion = this.form.get('descripcion')?.value;
    return td;
  }

  private validado(): boolean {
    let val = true;
    Object.keys(this.form.controls).forEach((key) => {
      const ctrl = this.form.get(key);
      if (ctrl !== null) {
        ctrl.markAsDirty();
        ctrl.updateValueAndValidity();
        if (!ctrl.disabled) {
          val = val && ctrl.valid;
        }
      }
    });
    return val;
  }

  guardar(): void {
    if(this.validado()){
      if(this.idtipodomicilio === 'nuevo'){
        this.registrar();
      }else{
        this.modificar();
      }
    }
  }
  private modificar(): void {
    this.guardarLoading = true;
    const td: TipoDomicilio = this.getDto();
    this.tipoDomSrv.put(+this.idtipodomicilio, td).subscribe(()=>{
      this.notif.create('success', 'Guardado correctamente', '');
      this.idtipodomicilio = `${td.id}`;
      this.router.navigate([td.id], {relativeTo: this.aroute.parent});
      this.guardarLoading = false;
    }, (e)=>{
      console.log('Error al modificar tipo de domicilio');
      console.log(e);
      this.httpErrorHandler.handle(e);
      //this.notif.create('error', 'Error al guarddar', e.error);
      this.guardarLoading = false;
    });
  }

  private registrar(): void{
    this.guardarLoading = true;
    this.tipoDomSrv.post(this.getDto()).subscribe(()=>{
      this.form.reset();
      this.notif.create('success', 'Guardado correctamente', '');
      this.guardarLoading = false;
    }, (e)=>{
      console.log('Error al registrar tipo domicilio');
      console.log(e);
      this.httpErrorHandler.handle(e);
      //this.notif.create('error', 'Error al guardar', e.error);
      this.guardarLoading = false;
    })
  }

}
