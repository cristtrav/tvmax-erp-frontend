import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaSuscripcionesComponent } from './vista-suscripciones.component';

describe('VistaSuscripcionesComponent', () => {
  let component: VistaSuscripcionesComponent;
  let fixture: ComponentFixture<VistaSuscripcionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistaSuscripcionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaSuscripcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
