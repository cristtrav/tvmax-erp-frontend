import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Cliente } from '@dto/cliente-dto';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { UsuarioDTO } from '@dto/usuario.dto';
import { UsuariosService } from '@services/usuarios.service';
import { ResponsiveSizes } from '@global-utils/responsive/responsive-sizes.interface';
import { ResponsiveUtils } from '@global-utils/responsive/responsive-utils';
import { ClientesService } from '@services/clientes.service';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { SifenService } from '@services/facturacion/sifen.service';
import { finalize } from 'rxjs';
import { ConsultaRucSifenDTO } from '@dto/facturacion/consulta-ruc-sifen.dto';

@Component({
  selector: 'app-detalle-cliente',
  templateUrl: './detalle-cliente.component.html',
  styleUrls: ['./detalle-cliente.component.scss']
})
export class DetalleClienteComponent implements OnInit {

  //readonly FORM_SIZES: ResponsiveSizes = { nzXXl:12, nzXl:14, nzLg:16, nzMd:18, nzSm:20 };
  readonly FORM_SIZES: ResponsiveSizes = ResponsiveUtils.DEFAUT_FORM_SIZES;
  readonly LABEL_SIZES: ResponsiveSizes = ResponsiveUtils.DEFAULT_FORM_LABEL_SIZES;
  readonly CONTROL_SIZES: ResponsiveSizes = ResponsiveUtils.DEFALUT_FORM_CONTROL_SIZES;
  
  idcliente = 'nuevo';
  guardarLoading: boolean = false;
  formLoading: boolean = false;
  lastIdLoading: boolean = false;
  lstCobradores: UsuarioDTO[] = [];

  consultandoRuc: boolean = false;
  modalConsultaRucVisible: boolean = false;
  consultaRuc?: ConsultaRucSifenDTO;

  form: FormGroup = new FormGroup({
    id: new FormControl(null, [Validators.required]),
    nombres: new FormControl(null, [Validators.minLength(2), Validators.maxLength(80)]),
    apellidos: new FormControl(null, [Validators.minLength(2), Validators.maxLength(80)]),
    razonsocial: new FormControl(null, [Validators.minLength(2), Validators.required, Validators.maxLength(160)]),
    ci: new FormControl(null, [Validators.minLength(2), Validators.maxLength(15)]),
    dvruc: new FormControl(null),
    telefono1: new FormControl(null, [Validators.minLength(4), Validators.maxLength(20)]),
    telefono2: new FormControl(null, [Validators.minLength(4), Validators.maxLength(20)]),
    email: new FormControl(null, [Validators.maxLength(120), Validators.email]),
    idcobrador: new FormControl(null, [Validators.required]),
  });
  

  constructor(
    private usuariosSrv: UsuariosService,
    private notif: NzNotificationService,
    private clienteSrv: ClientesService,
    private aroute: ActivatedRoute,
    private router: Router,
    private httpErrorHandler: HttpErrorResponseHandlerService,
    private sifenSrv: SifenService
  ) { }

  ngOnInit(): void {
    this.idcliente = this.aroute.snapshot.paramMap.get('idcliente') ?? 'nuevo';
    if (Number.isInteger(Number(this.idcliente))) this.cargarDatos();
    this.cargarCobradores();
  }

  calculteID() {
    this.lastIdLoading = true;
    this.clienteSrv.getUltimoId().subscribe({
      next: (lastid) => {
        this.form.controls.id.setValue(lastid + 1);
        this.lastIdLoading = false;
      },
      error: (e) => {
        console.error('Error al cargar ultimo ID de Clientes', e);
        this.httpErrorHandler.process(e);
        this.lastIdLoading = false;
      }
    });
  }

  private cargarCobradores(): void {
    const params: HttpParams = new HttpParams()
      .append('eliminado', 'false')
      .append('idrol', '3');
    this.usuariosSrv.get(params).subscribe({
      next: (usuarios) => {
        this.lstCobradores = usuarios;
      },
      error: (e) => {
        console.error('Error al cargar cobradores', e);
        this.httpErrorHandler.process(e);
      }
    })
  }

  guardar(): void {
    this.verificarCi();
    Object.keys(this.form.controls).forEach((ctrlName) => {
      this.form.get(ctrlName)?.markAsDirty();
      this.form.get(ctrlName)?.updateValueAndValidity();
    });
    if (this.form.valid) {
      if (this.idcliente === 'nuevo') this.registrar();
      else this.modificar();
    }
  }

  private getDto(): Cliente {
    const cli: Cliente = new Cliente();

    cli.id = this.form.controls.id.value;
    cli.nombres = this.form.controls.nombres.value;
    cli.apellidos = this.form.controls.apellidos.value;
    cli.razonsocial = this.form.controls.razonsocial.value;
    cli.ci = this.form.controls.ci.value;
    cli.dvruc = this.form.controls.dvruc.value;
    cli.telefono1 = this.form.controls.telefono1.value;
    cli.telefono2 = this.form.controls.telefono2.value;
    cli.email = this.form.controls.email.value;
    cli.idcobrador = this.form.controls.idcobrador.value;

    return cli;
  }

  private registrar(): void {
    this.guardarLoading = true;
    this.clienteSrv.post(this.getDto()).subscribe({
      next: () => {
        this.notif.create('success', '<strong>Éxito</strong>', 'Cliente registrado.');
        this.form.reset();
        this.guardarLoading = false;
      },
      error: (e) => {
        console.error('Error al registrar Cliente', e);
        this.httpErrorHandler.process(e);
        this.guardarLoading = false;
      }
    });
  }

  private modificar(): void {
    this.guardarLoading = true;
    const cliente = this.getDto();
    this.clienteSrv.put(Number(this.idcliente), cliente).subscribe({
      next: () => {
        this.notif.create('success', '<strong>Éxito</strong>', 'Cliente editado.');
        this.idcliente = `${cliente.id}`;
        this.router.navigate([cliente.id], { relativeTo: this.aroute.parent });
        this.guardarLoading = false;
      },
      error: (e) => {
        console.error('Error al editar Cliente', e);
        this.httpErrorHandler.process(e);
        this.guardarLoading = false;
      }
    });
  }

  cargarRazonSocial(): void {
    const nombres = this.form.controls.nombres.value ?? '';
    const apellidos = this.form.controls.apellidos.value ?? '';
    this.form.controls.razonsocial.setValue(`${apellidos} ${nombres}`.trim());
  }

  private cargarDatos(): void {
    this.formLoading = true;
    this.clienteSrv.getPorId(Number(this.idcliente)).subscribe({
      next: (cliente) => {
        this.form.controls.id.setValue(cliente.id);
        this.form.controls.nombres.setValue(cliente.nombres);
        this.form.controls.apellidos.setValue(cliente.apellidos);
        this.form.controls.razonsocial.setValue(cliente.razonsocial);
        this.form.controls.ci.setValue(cliente.ci);
        this.form.controls.dvruc.setValue(cliente.dvruc);
        this.form.controls.telefono1.setValue(cliente.telefono1);
        this.form.controls.telefono2.setValue(cliente.telefono2);
        this.form.controls.email.setValue(cliente.email);
        this.form.controls.idcobrador.setValue(cliente.idcobrador);
        this.formLoading = false;
      },
      error: (e) => {
        console.error('Error al cargar cliente por ID', e);
        this.httpErrorHandler.process(e);
        this.formLoading = false;
      }
    });
  }

  verificarCi(): void {
    if(!this.form.controls.ci.value) this.form.controls.dvruc.reset();
  }

  consultarRuc(){
    if(!this.form.controls.ci.value) return;

    this.consultandoRuc = true;
    this.sifenSrv.consultarRuc(this.form.controls.ci.value)
    .pipe(finalize(() => this.consultandoRuc = false))
    .subscribe({
      next: (consulta) => {
        this.consultaRuc = consulta;
        this.mostrarModalConsultaRuc();
      }
    })
  }

  cerrarModalConsultaRuc(){
    this.modalConsultaRucVisible = false;
  }

  mostrarModalConsultaRuc(){
    this.modalConsultaRucVisible = true;
  }
}
