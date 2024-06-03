import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cliente } from '@dto/cliente-dto';
import { Suscripcion } from '@dto/suscripcion-dto';
import { ClientesService } from '@services/clientes.service';
import { SuscripcionesService } from '@services/suscripciones.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-cuotas-suscripcion-cliente',
  templateUrl: './cuotas-suscripcion-cliente.component.html',
  styleUrls: ['./cuotas-suscripcion-cliente.component.scss']
})
export class CuotasSuscripcionClienteComponent implements OnInit {

  idcliente: number | null = null;
  idsuscripcion: number | null = null;
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
    if(idcli){
      this.idcliente = +idcli;
      this.cargarCliente();
    }
    const idsus = this.aroute.snapshot.paramMap.get('idsuscripcion');
    if(idsus){
      this.idsuscripcion = +idsus;
      this.cargarSuscripcion();
    }
  }

  private cargarCliente(): void{
    if(this.idcliente){
      this.cliSrv.getPorId(this.idcliente).subscribe((data)=>{
        this.cliente = data;
      }, (e)=>{
        console.log('Error al cargar cliente');
        console.log(e);
        this.notif.create('error', 'Error al cargar datos del cliente', e.error);
      });
    }
  }

  private cargarSuscripcion(): void{
    if(this.idsuscripcion){
      this.suscSrv.getPorId(this.idsuscripcion).subscribe((data)=>{
        this.suscripcion = data;
      }, (e)=>{
        console.log('Error al cargar suscripcion');
        console.log(e);
        this.notif.create('error', 'Error al cargar suscripción', e.error);
      });
    }
  }

}
