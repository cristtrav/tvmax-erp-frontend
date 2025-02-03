import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Talonario } from '@dto/facturacion/talonario.dto';
import { TimbradoDTO } from '@dto/facturacion/timbrado.dto';
import { FormTalonarioComponent } from '@modules/talonarios/components/form-talonario/form-talonario.component';
import { TimbradosService } from '@services/facturacion/timbrados.service';

@Component({
  selector: 'app-detalle-timbrado-talonario',
  templateUrl: './detalle-timbrado-talonario.component.html',
  styleUrls: ['./detalle-timbrado-talonario.component.scss']
})
export class DetalleTimbradoTalonarioComponent implements OnInit {

  @ViewChild(FormTalonarioComponent)
  formTalonarioComp!: FormTalonarioComponent;

  nrotimbrado!: number;
  idtalonario: string = 'nuevo';
  timbrado!: TimbradoDTO;

  constructor(
    private timbradosSrv: TimbradosService,
    private aroute: ActivatedRoute,
    private router: Router
  ){}

  ngOnInit(): void {
    const nroTimbradoStr = this.aroute.snapshot.paramMap.get('nrotimbrado');
    if(nroTimbradoStr){
      this.nrotimbrado = Number(nroTimbradoStr);
      this.cargarTimbrado();
    }

    const idtalonarioStr = this.aroute.snapshot.paramMap.get('idtalonario');
    if(Number.isInteger(Number(idtalonarioStr))) this.idtalonario = `${idtalonarioStr}`;
    
  }

  cargarTimbrado(){
    this.timbradosSrv
      .getByNroTimbrado(this.nrotimbrado)
      .subscribe(timbrado => this.timbrado = timbrado)
  }

  onEditTalonario(talonario: Talonario){    
    this.idtalonario = `${talonario.id}`;
    this.nrotimbrado = talonario.nrotimbrado ?? -1;
    
    this.router.navigate(['/app/timbrados', this.nrotimbrado, 'talonarios', this.idtalonario]);
  }

}
