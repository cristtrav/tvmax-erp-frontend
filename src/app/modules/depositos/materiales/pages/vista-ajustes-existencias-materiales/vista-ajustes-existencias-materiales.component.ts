import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MaterialDTO } from '@dto/depositos/material.dto';
import { TablaAjustesExistenciasComponent } from '@modules/depositos/ajustes-existencias/components/tabla-ajustes-existencias/tabla-ajustes-existencias.component';
import { MaterialesService } from '@services/depositos/materiales.service';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';

@Component({
  selector: 'app-vista-ajustes-existencias-materiales',
  templateUrl: './vista-ajustes-existencias-materiales.component.html',
  styleUrls: ['./vista-ajustes-existencias-materiales.component.scss']
})
export class VistaAjustesExistenciasMaterialesComponent implements OnInit {

  @ViewChild(TablaAjustesExistenciasComponent)
  tablaAjustesExistenciasComp!: TablaAjustesExistenciasComponent;

  idmaterial?: number;
  material?: MaterialDTO;
  
  constructor(
    private aroute: ActivatedRoute,
    private materialesSrv: MaterialesService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ){}

  ngOnInit(): void {
    const idmaterialStr = this.aroute.snapshot.paramMap.get('idmaterial');
    this.idmaterial = Number.isInteger(Number(idmaterialStr)) ? Number(idmaterialStr) : -1; 
    this.cargarMaterial(this.idmaterial);
  }

  cargarMaterial(idmaterial: number){
    this.materialesSrv
      .getPorId(idmaterial)
      .subscribe({
        next: (material) => this.material = material,
        error: (e) => {
          console.error('Error al cargar material', e);
          this.httpErrorHandler.process(e);
        }
      });
  }

  recargarExitencias(){
    this.tablaAjustesExistenciasComp?.cargarDatos();
  }

}
