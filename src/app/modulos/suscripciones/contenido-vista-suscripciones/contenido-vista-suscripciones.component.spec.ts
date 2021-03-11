import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContenidoVistaSuscripcionesComponent } from './contenido-vista-suscripciones.component';

describe('ContenidoVistaSuscripcionesComponent', () => {
  let component: ContenidoVistaSuscripcionesComponent;
  let fixture: ComponentFixture<ContenidoVistaSuscripcionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContenidoVistaSuscripcionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContenidoVistaSuscripcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
