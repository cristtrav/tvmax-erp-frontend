import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MaterialDTO } from '@dto/depositos/material.dto';
import { MaterialesService } from '@services/depositos/materiales.service';
import { HttpErrorResponseHandlerService } from '@services/http-utils/http-error-response-handler.service';

@Component({
  selector: 'app-detalle-ajuste-existencia-material',
  templateUrl: './detalle-ajuste-existencia-material.component.html',
  styleUrls: ['./detalle-ajuste-existencia-material.component.scss']
})
export class DetalleAjusteExistenciaMaterialComponent implements OnInit {

  idajusteMaterial: string = 'nuevo';
  idmaterial?: number;
  material?: MaterialDTO;

  constructor(
    private arouter: ActivatedRoute,
    private materialesSrv: MaterialesService,
    private httpErrorHandler: HttpErrorResponseHandlerService
  ) { }

  ngOnInit(): void {
    const idmaterialStr = this.arouter.snapshot.paramMap.get('idmaterial');
    if (Number.isInteger(Number(idmaterialStr))) this.idmaterial = Number(idmaterialStr);
    if (this.idmaterial != null) this.cargarMaterial(this.idmaterial);

    const idajusteMaterialStr = this.arouter.snapshot.paramMap.get('idajusteexistencia');
    this.idajusteMaterial = Number.isInteger(Number(idajusteMaterialStr)) ? `${idajusteMaterialStr}` : 'nuevo';
  }

  cargarMaterial(idmaterial: number) {
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

  onSaved(idajuste: string) {
    this.idajusteMaterial = idajuste;
    if (this.idmaterial != null)
      this.cargarMaterial(this.idmaterial);
  }

}
