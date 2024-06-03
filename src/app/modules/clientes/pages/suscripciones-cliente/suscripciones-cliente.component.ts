import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cliente } from '@dto/cliente-dto';
import { ClientesService } from '@services/clientes.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-suscripciones-cliente',
  templateUrl: './suscripciones-cliente.component.html',
  styleUrls: ['./suscripciones-cliente.component.scss']
})
export class SuscripcionesClienteComponent implements OnInit {

  @Input()
  idcliente: number | null = null;
  cliente: Cliente | null = null;

  constructor(
    private aroute: ActivatedRoute,
    private cliSrv: ClientesService,
    private notif: NzNotificationService
  ) { }

  ngOnInit(): void {
    const idcli = this.aroute.snapshot.paramMap.get('idcliente');
    if (idcli) {
      this.idcliente = +idcli;
      this.cargarDatosCliente();
    }
  }

  private cargarDatosCliente(): void {
    if (this.idcliente) {
      this.cliSrv.getPorId(this.idcliente).subscribe((data) => {
        this.cliente = data;
      }, (e) => {
        console.log('Error al cargar datos del cliente');
        console.log(e);
        this.notif.create('error', 'Error al cargar datos del cliente', e.error);
      });
    }
  }

}
