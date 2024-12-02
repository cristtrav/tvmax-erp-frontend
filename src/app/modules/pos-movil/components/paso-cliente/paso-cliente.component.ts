import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Cliente } from '@dto/cliente-dto';
import { ClientesService } from '@services/clientes.service';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-paso-cliente',
  templateUrl: './paso-cliente.component.html',
  styleUrls: ['./paso-cliente.component.scss']
})
export class PasoClienteComponent implements OnInit {

  cargaInicial: boolean = true;
  timerBusqueda: any;
  lstClientes: Cliente[] = [];
  loadingClientes: boolean = false;

  idCliente: number | null = null;
  
  @Input()
  set cliente(cliente: Cliente | null){
    this._cliente = cliente;
    if(cliente) this.idCliente = cliente.id;
    else this.idCliente = null;
  }

  get cliente(): Cliente | null {
    return this._cliente;
  }
  private _cliente: Cliente | null = null;
  
  @Output()
  clienteChange: EventEmitter<Cliente | null> = new EventEmitter();

  constructor(
    private clientesSrv: ClientesService,
    private httpErrorHandlerSrv: HttpErrorResponseHandlerService
  ){}

  ngOnInit(): void {
    this.cargarClientes();
  }

  private cargarClientes(){
    this.loadingClientes = true;
    this.clientesSrv.get(this.getParams())
    .pipe(finalize(() => this.loadingClientes = false))
    .subscribe({
      next: (clientes: Cliente[]) => {
        this.lstClientes = clientes;
        if(this.idCliente != null && !clientes.some(c => c.id == this.idCliente)){
          this.agregarCliente(this.idCliente);
        }
      },
      error: (e) => {
        console.error('Error al cargar clientes', e);
        this.httpErrorHandlerSrv.process(e);
      }
    })
  }

  public buscarCliente(busqueda: string){
    clearTimeout(this.timerBusqueda);
    this.timerBusqueda = setTimeout(() => {
      let params = this.getParams();
      params = params.append('search', busqueda);
      this.loadingClientes = true;
      this.clientesSrv.get(params)
      .pipe(finalize(() => this.loadingClientes = false))
      .subscribe({
        next: clientes => this.lstClientes = clientes,
        error: (e) => {
          this.httpErrorHandlerSrv.process(e);
          console.error(e);
        }
      })
    }, 300);
  }

  private getParams(): HttpParams {
    return new HttpParams()
    .append('limit', 10)
    .append('sort', '+razonsocial');
  }

  seleccionarCliente(idcliente: number){
    this.cliente = this.lstClientes.find(c => c.id == idcliente) ?? null;
    this.clienteChange.emit(this.cliente);
  }

  limpiar(){
    this.idCliente = null;
    this.cliente = null;
    this.clienteChange.emit(null);
  }

  private agregarCliente(idcliente: number){
    this.clientesSrv.getPorId(idcliente)
    .subscribe({
      next: (cliente) => this.lstClientes = this.lstClientes.concat([cliente]),
      error: (e) => console.log(`Error al obtener cliente por id: ${idcliente}`, e)
    })
  }

  refreshClienteSeleccionado(){
    if(this.cliente == null || this.cliente.id == null) return;
    this.clientesSrv.getPorId(this.cliente.id).subscribe({
      next: (cliente) => {
        this.lstClientes = this.lstClientes.map(cli => {
          if(cli.id == cliente.id) return cliente;
          else return cli;
        });
        this.seleccionarCliente(cliente.id ?? -1)
      },
      error: (e) => {
        console.error(`Error al recargar cliente seleccionado: ${e.message}`);
      }
    })
  }

}
