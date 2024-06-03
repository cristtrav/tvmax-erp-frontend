import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cliente } from '@dto/cliente-dto';
import { ClientesService } from '@global-services/clientes.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-domicilios-cliente',
  templateUrl: './domicilios-cliente.component.html',
  styleUrls: ['./domicilios-cliente.component.scss']
})
export class DomiciliosClienteComponent implements OnInit {

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

  cargarDatosCliente(): void {
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
