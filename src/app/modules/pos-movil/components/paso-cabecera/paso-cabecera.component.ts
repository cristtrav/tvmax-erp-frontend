import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Talonario } from '@dto/talonario.dto';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { TalonariosService } from '@services/facturacion/talonarios.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-paso-cabecera',
  templateUrl: './paso-cabecera.component.html',
  styleUrls: ['./paso-cabecera.component.scss']
})
export class PasoCabeceraComponent implements OnInit {

  @Input()
  totalVenta: number = 0;

  @Output()
  idtalonarioChange = new EventEmitter<number | null>();

  @Output()
  fechaChange = new EventEmitter<Date | null>();

  lstTalonarios: Talonario[] = [];
  loadingTalonarios: boolean = false;

  form = new FormGroup({
    fecha: new FormControl<Date | null>(null, [Validators.required]),
    idtalonario: new FormControl<number | null>(null, Validators.required)
  });

  constructor(
    private talonariosSrv: TalonariosService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ){}

  ngOnInit(): void {
    this.cargarTalonarios();
    this.form.controls.fecha.valueChanges.subscribe(value => this.fechaChange.emit(value))
    this.form.controls.idtalonario.valueChanges.subscribe(value => this.idtalonarioChange.emit(value));
    this.form.controls.fecha.setValue(new Date());
  }

  cargarTalonarios(){
    const params = new HttpParams()
    .append('eliminado', false)
    .append('activo', true)
    .append('electronico', true);
    this.loadingTalonarios = true;
    this.talonariosSrv.get(params)
    .pipe(finalize(() => this.loadingTalonarios = false))
    .subscribe({
      next: talonarios => {
        this.lstTalonarios = talonarios;
        if(this.form.controls.idtalonario.value == null && talonarios.length > 0)
          this.form.controls.idtalonario.setValue(talonarios[0].id);
      },
      error: (e) => {
        console.error('Error al cargar talonarios', e);
        this.httpErrorHandler.process(e);
      }
    })
  }  

}
