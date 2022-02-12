import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFiltroSuscripcionesComponent } from './form-filtro-suscripciones.component';

describe('FormFiltroSuscripcionesComponent', () => {
  let component: FormFiltroSuscripcionesComponent;
  let fixture: ComponentFixture<FormFiltroSuscripcionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormFiltroSuscripcionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormFiltroSuscripcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
