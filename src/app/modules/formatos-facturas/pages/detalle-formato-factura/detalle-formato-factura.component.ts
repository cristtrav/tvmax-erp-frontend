import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DetalleVenta } from '@dto/detalle-venta-dto';
import { FormatoFacturaDTO } from '@dto/formato-factura.dto';
import { Venta } from '@dto/venta.dto';
import { FormatosFacturasService } from '@services/formatos-facturas.service';
import { Extra } from '@util/extra';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FormatoFacturaA } from '@modules/impresion/factura-preimpresa-venta/formato-factura-a';

@Component({
  selector: 'app-detalle-formato-factura',
  templateUrl: './detalle-formato-factura.component.html',
  styleUrls: ['./detalle-formato-factura.component.scss']
})
export class DetalleFormatoFacturaComponent implements OnInit {

  idformato: string = 'nuevo';
  parametros: FormatoFacturaA = new FormatoFacturaA();

  ventaPrueba: Venta = Extra.getVentaPrueba()
  detallesPrueba: DetalleVenta[] = Extra.getDetalleVentaPrueba();

  form: FormGroup = new FormGroup({
    descripcion: new FormControl('',[Validators.required, Validators.maxLength(45)])
  });
  guardando: boolean = false;
  cargandoDatos: boolean = false;

  constructor(
    private formatosFacturasSrv: FormatosFacturasService,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private notification: NzNotificationService,
    private aroute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.idformato = this.aroute.snapshot.paramMap.get('id') ?? 'nuevo';
    if(this.idformato !== 'nuevo') this.cargarDatos(Number(this.idformato));
  }

  cargarDatos(idformato: number){
    this.cargandoDatos = true;
    this.formatosFacturasSrv.getPorId(idformato).subscribe({
      next: (formato) => {
        this.form.controls.descripcion.setValue(formato.descripcion);
        this.parametros = formato.parametros;
        this.cargandoDatos = false;
      },
      error: (e) => {
        console.error('Error al cargar formato de factura por id', e);
        this.httpErrorHandler.process(e);
        this.cargandoDatos = false;
      }
    })
  }

  guardar(){
    Object.keys(this.form.controls).forEach(ctrlName => {
      this.form.get(ctrlName)?.markAsDirty();
      this.form.get(ctrlName)?.updateValueAndValidity();
    });
    if(this.idformato === 'nuevo') this.registrar();
    else this.editar();
  }

  private registrar(){
    this.guardando = true;
    this.formatosFacturasSrv.post(this.getDto()).subscribe({
      next: () => {
        this.guardando = false;
        this.notification.create('success', '<strong>Éxito</strong>', 'Formato registrado')
      },
      error: (e) => {
        console.error('Error al registrar formato de factura', e);
        this.httpErrorHandler.process(e);
        this.guardando = false;
      }
    })
  }

  private editar(){
    this.guardando = true;
    this.formatosFacturasSrv.put(Number(this.idformato), this.getDto()).subscribe({
      next: () => {
        this.guardando = false;
        this.notification.create('success', '<strong>Éxito</strong>', 'Formato editado');
      },
      error: (e) => {
        console.error('Error al editar formato factura', e);
        this.httpErrorHandler.process(e);
        this.guardando = false;
      }
    });
  }

  getDto(): FormatoFacturaDTO{
    return {      
      descripcion: this.form.controls.descripcion.value,
      tipoFactura: 'PRE',
      plantilla: 'PRE-A',
      parametros: this.parametros,
      eliminado: false
    }
  }

  cargarPorDefecto(){
    this.parametros = new FormatoFacturaA();
  }

}
