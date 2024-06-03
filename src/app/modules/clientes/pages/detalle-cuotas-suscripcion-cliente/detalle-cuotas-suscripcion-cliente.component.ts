import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Cliente } from '@dto/cliente-dto';
import { ClientesService } from '@services/clientes.service';
import { SuscripcionesService } from '@services/suscripciones.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Suscripcion } from '@dto/suscripcion-dto';

@Component({
  selector: 'app-detalle-cuotas-suscripcion-cliente',
  templateUrl: './detalle-cuotas-suscripcion-cliente.component.html',
  styleUrls: ['./detalle-cuotas-suscripcion-cliente.component.scss']
})
export class DetalleCuotasSuscripcionClienteComponent implements OnInit {

  idcliente: number | null = null;
  idsuscripcion: number | null = null;
  idcuota = 'nueva';
  cliente: Cliente | null = null;
  suscripcion: Suscripcion | null = null;

  constructor(
    private aroute: ActivatedRoute,
    private cliSrv: ClientesService,
    private notif: NzNotificationService,
    private suscSrv: SuscripcionesService
  ) { }

  ngOnInit(): void {
    const idcli = this.aroute.snapshot.paramMap.get('idcliente');
    if (idcli) {
      this.idcliente = +idcli;
      this.cargarCliente();
    }
    const idsus = this.aroute.snapshot.paramMap.get('idsuscripcion');
    if (idsus) {
      this.idsuscripcion = +idsus;
      this.cargarSuscripcion();
    }
    const idcuo = this.aroute.snapshot.paramMap.get('idcuota');
    if(idcuo){
      this.idcuota = idcuo;
    }
  }

  private cargarCliente(): void {
    if (this.idcliente) {
      this.cliSrv.getPorId(this.idcliente).subscribe((data) => {
        this.cliente = data;
      }, (e) => {
        console.log('Error al cargar datos del cliente');
        console.log(e);
        this.notif.create('error', 'Error al cargar cliente', e.error);
      });
    }
  }

  private cargarSuscripcion(): void {
    const ids = this.idsuscripcion ? this.idsuscripcion : -1;
    if (ids) {
      this.suscSrv.getPorId(ids).subscribe((data) => {
        this.suscripcion = data;
      }, (e) => {
        console.log('Error al cargar suscripcion');
        console.log(e);
        this.notif.create('error', 'Error al cargar suscripción', e.error);
      });
    }
  }

}
