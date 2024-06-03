import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cliente } from '@dto/cliente-dto';
import { ClientesService } from '@services/clientes.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-detalle-suscripcion-cliente',
  templateUrl: './detalle-suscripcion-cliente.component.html',
  styleUrls: ['./detalle-suscripcion-cliente.component.scss']
})
export class DetalleSuscripcionClienteComponent implements OnInit {

  idsuscripcion = 'nueva';
  idcliente: number | null = null;
  cliente: Cliente | null = null;

  constructor(
    private aroute: ActivatedRoute,
    private cliSrv: ClientesService,
    private notif: NzNotificationService
  ) { }

  ngOnInit(): void {
    const idcli = this.aroute.snapshot.paramMap.get('idcliente');
    if(idcli){
      this.idcliente = +idcli;
      this.cargarCliente();
    }
    const idsus = this.aroute.snapshot.paramMap.get('idsuscripcion');
    if(idsus){
      this.idsuscripcion = idsus;
    }

  }

  private cargarCliente(): void{
    if(this.idcliente){
      this.cliSrv.getPorId(this.idcliente).subscribe((data)=>{
        this.cliente = data;
      }, (e)=>{
        console.log('Error al cargar datos del cliente');
        console.log(e);
        this.notif.create('error', 'Error al cargar datos del cliente', e.error);
      });
    }
  }

}
