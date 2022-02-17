import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaSuscripcionesComponent } from './tabla-suscripciones.component';

describe('TablaSuscripcionesComponent', () => {
  let component: TablaSuscripcionesComponent;
  let fixture: ComponentFixture<TablaSuscripcionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaSuscripcionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaSuscripcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
