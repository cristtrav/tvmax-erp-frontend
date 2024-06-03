import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClientesService } from '../../../../global/services/clientes.service';
import { Cliente } from '../../../../dto/cliente-dto';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-detalle-domicilio-cliente',
  templateUrl: './detalle-domicilio-cliente.component.html',
  styleUrls: ['./detalle-domicilio-cliente.component.scss']
})
export class DetalleDomicilioClienteComponent implements OnInit {

  @Input()
  idcliente: number | null = null;

  iddomicilio = 'nuevo';
  cliente: Cliente | null = null;

  constructor(
    private aroute: ActivatedRoute,
    private cliSrv: ClientesService,
    private notif: NzNotificationService
  ) { }

  ngOnInit(): void {
    const idcli = this.aroute.snapshot.paramMap.get('idcliente');
    const iddomi = this.aroute.snapshot.paramMap.get('iddomicilio');
    if (iddomi) {
      this.iddomicilio = iddomi;
    }
    if (idcli) {
      this.idcliente = +idcli;
    }
    this.cargarDatosCliente();
  }

  private cargarDatosCliente(): void {
    if (this.idcliente !== null) {
      this.cliSrv.getPorId(+this.idcliente).subscribe((data) => {
        this.cliente = data;
      }, (e) => {
        console.log('Error al cargar datos de cliente');
        console.log(e);
        this.notif.create('error', 'Error al cargar datos del cliente', e.error);
      });
    }
  }
}

