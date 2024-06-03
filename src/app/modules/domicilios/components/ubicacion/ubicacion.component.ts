import { AfterViewInit, Component, Input } from '@angular/core';
import { Icon, LatLngTuple, LeafletMouseEvent, Map, Marker, TileLayer, canvas, marker, tileLayer } from 'leaflet';

@Component({
  selector: 'app-ubicacion',
  templateUrl: './ubicacion.component.html',
  styleUrls: ['./ubicacion.component.scss']
})
export class UbicacionComponent implements AfterViewInit {

  readonly DEFAULT_LOCATION: LatLngTuple = [-25.44240, -56.44198];
  readonly LEAFLET_MARKER_ICON: Icon = new Icon({
    iconUrl:"assets/leaflet/marker-icon.png",
    iconRetinaUrl:"assets/leaflet/marker-icon-2x.png",
    shadowUrl:"assets/leaflet/marker-shadow.png",
    iconSize:[25,41],
    iconAnchor:[12,41],
    popupAnchor:[1,-34],
    tooltipAnchor:[16,-28],
    shadowSize:[41,41]
  });

  @Input()
  soloLectura: boolean = false;
  
  @Input()
  set ubicacion(u: LatLngTuple | null){
    this.setMarkerLocation(u);
    this._ubicacion = u;
  }
  get ubicacion(): LatLngTuple | null{
    return this._ubicacion;
  }
  private _ubicacion: LatLngTuple | null = null;

  map!: Map;
  marker: Marker | null = null;
  tileLayer!: TileLayer;

  constructor(){}

  ngAfterViewInit(): void {
    this.map = new Map('mapa').setView(this.ubicacion ?? this.DEFAULT_LOCATION, 16);
    this.tileLayer = tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
    this.setMarkerLocation(this.ubicacion);
    if(!this.soloLectura) this.map.on('click', (e: LeafletMouseEvent) => {      
      this.setUbicacion([e.latlng.lat, e.latlng.lng]);
    });
    this.map.invalidateSize(); //Para corregir error de carga inicial en Firefox
  }

  setUbicacion(ubi: LatLngTuple){
    this.ubicacion = ubi;
    this.setMarkerLocation(ubi);
  }

  setMarkerLocation(ubi: LatLngTuple | null){
    if(ubi == null) this.removeMarker();
    else{
      if(this.marker != null) this.marker.setLatLng(ubi);
      else if(this.map != null) this.marker = marker(ubi, {icon: this.LEAFLET_MARKER_ICON}).addTo(this.map);
    }
  }

  removeMarker(){
    if(this.marker != null) this.marker.removeFrom(this.map);
  }

  centrarVista(){
    if(this.map != null && this.ubicacion != null)
      this.map.setView(this.ubicacion, this.map.getZoom());
  }

}