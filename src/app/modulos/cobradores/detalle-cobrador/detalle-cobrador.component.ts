import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Cobrador } from './../../../dto/cobrador-dto';
import { CobradoresService } from './../../../servicios/cobradores.service';

@Component({
  selector: 'app-detalle-cobrador',
  templateUrl: './detalle-cobrador.component.html',
  styleUrls: ['./detalle-cobrador.component.scss']
})
export class DetalleCobradorComponent implements OnInit {

  idcobrador = 'nuevo';
  form: FormGroup = this.fb.group({
    id: [null, [Validators.required]],
    razonsocial: [null, [Validators.required, Validators.maxLength(150)]],
    ci: [null],
    dv: [null],
    telefono: [null],
    email: [null, [Validators.email]],
    activo: [false]
  });
  guardarLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private cobradoresSrv: CobradoresService,
    private notif: NzNotificationService,
    private aroute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.aroute.snapshot.paramMap.get('id');
    if (id !== null) {
      this.idcobrador = id;
      if (id !== 'nuevo') {
        this.cargarDatos();
      }
    }
  }

  cargarDatos(): void {
    this.cobradoresSrv.getPorId(+this.idcobrador).subscribe((data) => {
      this.form.get('id')?.setValue(data.id);
      this.form.get('razonsocial')?.setValue(data.razonsocial);
      this.form.get('ci')?.setValue(data.ci);
      this.form.get('dv')?.setValue(data.dvruc);
      this.form.get('telefono')?.setValue(data.telefono);
      this.form.get('email')?.setValue(data.email);
      this.form.get('activo')?.setValue(data.activo);
    }, (e) => {
      console.log('Error al cargar datos');
      console.log(e);
      this.notif.create('error', 'Error al cargar datos del cobrador', e.error);
    });
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

  private getDto(): Cobrador {
    const ci = this.form.get('ci')?.value;
    const dvruc = this.form.get('dv')?.value;
    const telefono = this.form.get('telefono')?.value;
    const email = this.form.get('email')?.value;

    const c: Cobrador = new Cobrador();
    c.id = this.form.get('id')?.value;
    c.razonsocial = this.form.get('razonsocial')?.value;
    c.ci = ci === '' ? null : ci;
    c.dvruc = dvruc === '' ? null : dvruc;
    c.telefono = telefono === '' ? null : telefono;
    c.email = email === '' ? null : email;
    c.activo = this.form.get('activo')?.value;
    return c;
  }

  guardar(): void {
    if (this.validado()) {
      if (this.idcobrador === 'nuevo') {
        this.registrar();
      } else {
        this.modificar();
      }
    }
  }

  private registrar(): void {
    this.cobradoresSrv.post(this.getDto()).subscribe(() => {
      this.form.reset();
      this.notif.create('success', 'Guardado correctamente', '');
    }, (e) => {
      console.log('Error al registrar cobrador');
      console.log(e);
      this.notif.create('error', 'Error al guardar', e.error);
    });
  }

  private modificar(): void {
    const c = this.getDto();
    this.cobradoresSrv.put(+this.idcobrador, c).subscribe(() => {
      this.notif.create('success', 'Guardado correctamente', '');
      this.idcobrador = `${c.id}`;
      this.router.navigateByUrl(`/cobradores/${c.id}`);
    }, (e) => {
      console.log('Error al modificar cobrador');
      console.log(e);
      this.notif.create('error', 'Error al guardar', e.error);
    });
  }

}
