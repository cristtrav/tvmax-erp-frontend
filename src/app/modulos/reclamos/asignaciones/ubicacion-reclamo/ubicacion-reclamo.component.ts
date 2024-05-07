import { Component, Inject, InjectionToken, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReclamoDTO } from '@global-dtos/reclamos/reclamo.dto';
import { ReclamosService } from '@global-services/reclamos/reclamos.service';
import { LatLngTuple } from 'leaflet';
import { finalize } from 'rxjs';
import { UbicacionComponent } from 'src/app/modulos/domicilios/ubicacion/ubicacion.component';

const WINDOW = new InjectionToken<Window>('Global window object', {
  factory: () => window
})

@Component({
  selector: 'app-ubicacion-reclamo',
  templateUrl: './ubicacion-reclamo.component.html',
  styleUrls: ['./ubicacion-reclamo.component.scss']
})
export class UbicacionReclamoComponent implements OnInit {

  @ViewChild(UbicacionComponent) private ubicacionComp!: UbicacionComponent;
  idreclamo: string = '';
  reclamo?: ReclamoDTO;
  loadingReclamo: boolean = false;

  constructor(
    @Inject(WINDOW) private window: Window,
    private aroute: ActivatedRoute,
    private router: Router,
    private reclamosSrv: ReclamosService
  ){}
  
  ngOnInit(): void {
    const strIdreclamo = this.aroute.snapshot.paramMap.get('idreclamo');
    if(Number.isInteger(Number(strIdreclamo))){
      this.idreclamo = `${strIdreclamo}`;
      this.cargarDatos(Number(strIdreclamo));
    } else this.router.navigate(['/app/asignacionesreclamos']);
  }

  cargarDatos(idreclamo: number){
    this.loadingReclamo = true;
    this.reclamosSrv.getPorId(idreclamo)
      .pipe(finalize(() => this.loadingReclamo = false))
      .subscribe((reclamo) => {
        this.reclamo = reclamo;
        if(reclamo.latitud && reclamo.longitud) setTimeout(() => {
          this.ubicacionComp.centrarVista();
        }, 250);
      })
  }

  abrirAppMapas(){
    if(this.reclamo?.latitud && this.reclamo.longitud){
      this.window.open(`https://maps.google.com/maps?daddr=${this.reclamo.latitud},${this.reclamo.longitud}&amp;ll=`)
    }
    
  }

}
