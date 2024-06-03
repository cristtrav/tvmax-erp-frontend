import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Inject, LOCALE_ID, OnInit, Output } from '@angular/core';
import { UsuarioDTO } from '@dto/usuario.dto';
import { TablaAuditoria } from '@dto/tabla-auditoria-dto';
import { AuditoriaService } from '@services/auditoria.service';
import { UsuariosService } from '@services/usuarios.service';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';
import { IParametroFiltro } from '@util/iparametrosfiltros.interface';

@Component({
  selector: 'app-form-filtro-evento-auditoria',
  templateUrl: './form-filtro-evento-auditoria.component.html',
  styleUrls: ['./form-filtro-evento-auditoria.component.scss']
})
export class FormFiltroEventoAuditoriaComponent implements OnInit {

  @Output()
  paramsFiltrosChange: EventEmitter<IParametroFiltro> = new EventEmitter();
  @Output()
  cantFiltrosChange: EventEmitter<number> = new EventEmitter();

  lstUsuarios: UsuarioDTO[] = [];
  lstTablas: TablaAuditoria[] = [];
  idUsuarioSelec: number | null = null;
  idTablaAuditoriaSelec: number | null = null
  fechaHoraDesde: Date | null = null;
  fechaHoraHasta: Date | null = null;
  registroSelec: boolean = false;
  modificacionSelec: boolean = false;
  eliminacionSelec: boolean = false;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private usuariosSrv: UsuariosService,
    private auditoriaSrv: AuditoriaService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargarUsuarios();
    this.cargarTablas();
  }

  async cargarUsuarios() {
    let params: HttpParams = new HttpParams();
    params = params.append('sort', '+nombres');
    this.usuariosSrv.get(params).subscribe({
      next: (usuarios) => {
        this.lstUsuarios = usuarios;
      },
      error: (e) => {
        console.log('Error al cargar usuarios');
        console.log(e);
        this.httpErrorHandler.handle(e);
      }
    })
  }

  async cargarTablas() {
    let params: HttpParams = new HttpParams();
    params = params.append('sort', '+descripcion');
    this.auditoriaSrv.getTablas(params).subscribe({
      next: (tablas) => {
        this.lstTablas = tablas;
      },
      error: (e) => {
        console.log('Error al cargar tablas de auditoria')
        console.log(e);
        this.httpErrorHandler.handle(e);
      }
    });
  }

  private getParametrosFiltros(): IParametroFiltro {
    const par: IParametroFiltro = {};
    if (this.idUsuarioSelec) par['idusuario'] = this.idUsuarioSelec;
    if (this.idTablaAuditoriaSelec) par['idtabla'] = this.idTablaAuditoriaSelec;
    if (this.fechaHoraDesde) par['fechahoradesde'] = this.fechaHoraDesde.toISOString();
    if (this.fechaHoraHasta) par['fechahorahasta'] = this.fechaHoraHasta.toISOString();
    if (this.registroSelec || this.modificacionSelec || this.eliminacionSelec) {
      const opeArr: string[] = [];
      if (this.registroSelec) opeArr.push('R');
      if (this.modificacionSelec) opeArr.push('M');
      if (this.eliminacionSelec) opeArr.push('E');
      par['operacion'] = opeArr;
    }
    return par;
  }

  private getCantFiltros(): number {
    let cant: number = 0;
    if (this.idUsuarioSelec) cant++;
    if (this.idTablaAuditoriaSelec) cant++;
    if (this.fechaHoraDesde) cant++;
    if (this.fechaHoraHasta) cant++;
    if (this.registroSelec) cant++;
    if (this.modificacionSelec) cant++;
    if (this.eliminacionSelec) cant++
    return cant;
  }

  limpiarFiltroUsuario() {
    this.idUsuarioSelec = null;
    this.onParamsFiltroChange();
  }

  limpiarFiltroTabla() {
    this.idTablaAuditoriaSelec = null;
    this.onParamsFiltroChange();
  }

  limpiarFiltrosFechaHora() {
    this.fechaHoraDesde = null;
    this.fechaHoraHasta = null;
    this.onParamsFiltroChange();
  }

  limpiarFiltrosOperacion() {
    this.registroSelec = false;
    this.modificacionSelec = false;
    this.eliminacionSelec = false;
    this.onParamsFiltroChange();
  }

  onParamsFiltroChange() {
    this.cantFiltrosChange.emit(this.getCantFiltros());
    this.paramsFiltrosChange.emit(this.getParametrosFiltros());
  }

  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.fechaHoraHasta) {
      return false;
    }
    const fh: Date = new Date(this.fechaHoraHasta.getTime());
    fh.setDate(fh.getDate() + 1);
    return startValue.getTime() > fh.getTime();
  };
  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.fechaHoraDesde) {
      return false;
    }
    const fd: Date = new Date(this.fechaHoraDesde.getTime());
    fd.setDate(fd.getDate() - 1);
    return endValue.getTime() <= fd.getTime();
  };
}
