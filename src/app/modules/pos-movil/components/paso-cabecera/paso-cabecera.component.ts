import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Timbrado } from '@dto/timbrado.dto';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { TimbradosService } from '@services/timbrados.service';
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
  idtimbradoChange = new EventEmitter<number | null>();

  @Output()
  fechaChange = new EventEmitter<Date | null>();

  lstTimbrados: Timbrado[] = [];
  loadingTimbrados: boolean = false;

  form = new FormGroup({
    fecha: new FormControl<Date | null>(null, [Validators.required]),
    idtimbrado: new FormControl<number | null>(null, Validators.required)
  });

  constructor(
    private timbradosSrv: TimbradosService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ){}

  ngOnInit(): void {
    this.cargarTimbrados();
    this.form.controls.fecha.valueChanges.subscribe(value => this.fechaChange.emit(value))
    this.form.controls.idtimbrado.valueChanges.subscribe(value => this.idtimbradoChange.emit(value));
    this.form.controls.fecha.setValue(new Date());
  }

  cargarTimbrados(){
    const params = new HttpParams()
    .append('eliminado', false)
    .append('activo', true)
    .append('electronico', true);
    this.loadingTimbrados = true;
    this.timbradosSrv.get(params)
    .pipe(finalize(() => this.loadingTimbrados = false))
    .subscribe({
      next: timbrados => {
        this.lstTimbrados = timbrados;
        if(this.form.controls.idtimbrado.value == null && timbrados.length > 0)
          this.form.controls.idtimbrado.setValue(timbrados[0].id);
      },
      error: (e) => {
        console.error('Error al cargar timbrados', e);
        this.httpErrorHandler.process(e);
      }
    })
  }  

}
