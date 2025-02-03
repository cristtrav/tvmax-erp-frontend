import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TimbradoDTO } from '@dto/facturacion/timbrado.dto';
import { TablaTalonariosComponent } from '@modules/talonarios/components/tabla-talonarios/tabla-talonarios.component';
import { TimbradosService } from '@services/facturacion/timbrados.service';

@Component({
  selector: 'app-vista-timbrado-talonarios',
  templateUrl: './vista-timbrado-talonarios.component.html',
  styleUrls: ['./vista-timbrado-talonarios.component.scss']
})
export class VistaTimbradoTalonariosComponent implements OnInit {

  @ViewChild(TablaTalonariosComponent)
  tablaTalonariosComp!: TablaTalonariosComponent;

  nrotimbrado!: number;
  timbrado!: TimbradoDTO;

  constructor(
    private aroute: ActivatedRoute,
    private timbradosSrv: TimbradosService
  ){}

  ngOnInit(): void {
    const nroTimbradoStr = this.aroute.snapshot.paramMap.get('nrotimbrado');
    if(nroTimbradoStr){
      this.nrotimbrado = Number(nroTimbradoStr);
      this.cargarTimbrado();
    }
  }

  cargarTimbrado(){
    this.timbradosSrv
      .getByNroTimbrado(this.nrotimbrado)
      .subscribe(timbrado => this.timbrado = timbrado)
  }

  recargar(){
    this.tablaTalonariosComp.cargarDatos();
  }

}
