import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-cabecera-reporte',
  templateUrl: './cabecera-reporte.component.html',
  styleUrls: ['./cabecera-reporte.component.scss']
})
export class CabeceraReporteComponent implements OnInit {

  @Input()
  public titulo: string = 'Sin título';

  constructor() { }

  ngOnInit(): void {
  }

}
