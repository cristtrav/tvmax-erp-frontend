import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuscripcionesClienteComponent } from './suscripciones-cliente.component';

describe('SuscripcionesClienteComponent', () => {
  let component: SuscripcionesClienteComponent;
  let fixture: ComponentFixture<SuscripcionesClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuscripcionesClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuscripcionesClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
