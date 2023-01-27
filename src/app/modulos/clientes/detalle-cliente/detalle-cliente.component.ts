import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Cliente } from 'src/app/dto/cliente-dto';
import { ClientesService } from './../../../servicios/clientes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { HttpErrorResponseHandlerService } from 'src/app/util/http-error-response-handler.service';
import { Usuario } from '@dto/usuario.dto';
import { UsuariosService } from '@servicios/usuarios.service';

@Component({
  selector: 'app-detalle-cliente',
  templateUrl: './detalle-cliente.component.html',
  styleUrls: ['./detalle-cliente.component.scss']
})
export class DetalleClienteComponent implements OnInit {

  idcliente = 'nuevo';
  guardarLoading: boolean = false;
  formLoading: boolean = false;
  lastIdLoading: boolean = false;
  lstCobradores: Usuario[] = [];

  form: FormGroup = new FormGroup({
    id: new FormControl(null, [Validators.required]),
    nombres: new FormControl(null, [Validators.minLength(2), Validators.maxLength(50)]),
    apellidos: new FormControl(null, [Validators.minLength(2), Validators.maxLength(50)]),
    razonsocial: new FormControl(null, [Validators.minLength(2), Validators.required, Validators.maxLength(100)]),
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
    private httpErrorHandler: HttpErrorResponseHandlerService
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
}
