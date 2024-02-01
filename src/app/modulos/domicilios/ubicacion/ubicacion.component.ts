import { AfterViewInit, Component, Input } from '@angular/core';
import { LatLngTuple, LeafletMouseEvent, Map, Marker, TileLayer, marker, tileLayer } from 'leaflet';

@Component({
  selector: 'app-ubicacion',
  templateUrl: './ubicacion.component.html',
  styleUrls: ['./ubicacion.component.scss']
})
export class UbicacionComponent implements AfterViewInit {

  readonly DEFAULT_LOCATION: LatLngTuple = [-25.44240, -56.44198];
  
  @Input()
  set ubicacion(u: LatLngTuple){
    if(this.marker) this.marker.setLatLng(u);
    this._ubicacion = u;
  }
  get ubicacion(): LatLngTuple{
    return this._ubicacion;
  }
  private _ubicacion: LatLngTuple = this.DEFAULT_LOCATION;

  map!: Map;
  marker!: Marker;
  tileLayer!: TileLayer;

  constructor(){}

  ngAfterViewInit(): void {
    this.map = new Map('mapa').setView(this.ubicacion, 16);
    this.tileLayer = tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    this.marker = marker(this.ubicacion).addTo(this.map);
    this.map.on('click', (e: LeafletMouseEvent) => {      
      this.setUbicacion([e.latlng.lat, e.latlng.lng]);
    })
  }

  setUbicacion(ubi: LatLngTuple){
    this.ubicacion = ubi;
    this.marker.setLatLng(ubi);
  }

  centrarVista(){
    if(this.map) this.map.setView(this.ubicacion, this.map.getZoom());
  }

}