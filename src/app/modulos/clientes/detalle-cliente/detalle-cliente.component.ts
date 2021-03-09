import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Cliente } from 'src/app/dto/cliente-dto';
import { Cobrador } from 'src/app/dto/cobrador-dto';
import { CobradoresService } from './../../../servicios/cobradores.service';
import { ClientesService } from './../../../servicios/clientes.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-detalle-cliente',
  templateUrl: './detalle-cliente.component.html',
  styleUrls: ['./detalle-cliente.component.scss']
})
export class DetalleClienteComponent implements OnInit {

  idcliente = 'nuevo';
  guardarLoading: boolean = false;
  form: FormGroup = this.fb.group({
    id: [null, [Validators.required]],
    nombres: [null, Validators.maxLength(50)],
    apellidos: [null, [Validators.maxLength(50)]],
    razonsocial: [null, [Validators.required, Validators.maxLength(100)]],
    ci: [null, [Validators.maxLength(15)]],
    dvruc: [null],
    telefono1: [null, [Validators.maxLength(20)]],
    telefono2: [null, [Validators.maxLength(20)]],
    email: [null, [Validators.maxLength(120), Validators.email]],
    idcobrador: [null, [Validators.required]],
  });
  lstCobradores: Cobrador[] = [];

  constructor(
    private fb: FormBuilder,
    private cobradoresSrv: CobradoresService,
    private notif: NzNotificationService,
    private cliSrv: ClientesService,
    private aroute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.aroute.snapshot.paramMap.get('idcliente');
    this.idcliente = `${id}`;
    if (id !== null) {
      if (this.idcliente !== 'nuevo') {
        this.cargarDatos();
      }
    }
    this.cargarCobradores();
  }

  private cargarCobradores(): void {
    this.cobradoresSrv.get().subscribe((data) => {
      this.lstCobradores = data;
    }, (e) => {
      console.log('Error al cargar cobradores');
      console.log(e);
      this.notif.create('error', 'Error al cargar cobradores', '');
    });
  }

  guardar(): void {
    if (this.validado()) {
      if (this.idcliente === 'nuevo') {
        this.verificarCi();
        this.registrar();
      } else {
        this.verificarCi();
        this.modificar();
      }
    }
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

  private getDto(): Cliente {
    const nomb = this.form.get('nombres')?.value;
    const apel = this.form.get('apellidos')?.value;
    const ci = this.form.get('ci')?.value;
    const dvruc = this.form.get('dvruc')?.value;
    const tel1 = this.form.get('telefono1')?.value;
    const tel2 = this.form.get('telefono2')?.value;
    const email = this.form.get('email')?.value;

    const cli: Cliente = new Cliente();
    cli.id = this.form.get('id')?.value;
    cli.nombres = nomb === '' ? null : nomb;
    cli.apellidos = apel === '' ? null : apel;
    cli.razonsocial = this.form.get('razonsocial')?.value;
    cli.ci = ci === '' ? null : ci;
    cli.dvruc = dvruc === '' ? null : dvruc;
    cli.telefono1 = tel1 === '' ? null : tel1;
    cli.telefono2 = tel2 === '' ? null : tel2;
    cli.email = email === '' ? null : email;
    cli.idcobrador = this.form.get('idcobrador')?.value;
    return cli;
  }

  private registrar(): void {
    this.guardarLoading = true;
    this.cliSrv.post(this.getDto()).subscribe(() => {
      this.notif.create('success', 'Guardado correctamente', '');
      this.form.reset();
      this.guardarLoading = false;
    }, (e) => {
      console.log('Error al guardar cliente');
      console.log(e);
      this.notif.create('error', 'Error al guardar', '');
      this.guardarLoading = false;
    });
  }

  private modificar(): void {
    this.guardarLoading = true;
    const c: Cliente = this.getDto();
    this.cliSrv.put(+this.idcliente, c).subscribe(() => {
      this.notif.create('success', 'Guardado correctamente', '');
      this.idcliente = `${c.id}`;
      this.router.navigateByUrl(`/clientes/${c.id}`);
      this.guardarLoading = false;
    }, (e) => {
      console.log('Error al modificar cliente');
      console.log(e);
      this.notif.create('error', 'Error al guardar', e.error);
      this.guardarLoading = false;
    });
  }

  cargarRazonSocial(): void {
    const nomb = this.form.get('nombres')?.value;
    const n = nomb === null ? '' : nomb;
    const apell = this.form.get('apellidos')?.value;
    const a = apell === null ? '' : apell;

    if (n !== '' || a !== '') {
      this.form.get('razonsocial')?.setValue(`${a} ${n}`.trim());
    }
  }

  private cargarDatos(): void {
    this.cliSrv.getPorId(+this.idcliente).subscribe((data) => {
      this.form.get('id')?.setValue(data.id);
      this.form.get('nombres')?.setValue(data.nombres);
      this.form.get('apellidos')?.setValue(data.apellidos);
      this.form.get('razonsocial')?.setValue(data.razonsocial);
      this.form.get('ci')?.setValue(data.ci);
      this.form.get('dvruc')?.setValue(data.dvruc);
      this.form.get('telefono1')?.setValue(data.telefono1);
      this.form.get('telefono2')?.setValue(data.telefono2);
      this.form.get('email')?.setValue(data.email);
      this.form.get('idcobrador')?.setValue(data.idcobrador);
    }, (e) => {
      console.log('Error al cargar cliente por id');
      console.log(e);
      this.notif.create('error', 'Error al cargar datos del cliente', e.error);
    });
  }

  verificarCi(): void{
    const ci = this.form.get('ci')?.value;
    if(!ci){
      this.form.get('dvruc')?.reset();
    }
  }

}
