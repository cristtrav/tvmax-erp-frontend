import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleSuscripcionClienteComponent } from './detalle-suscripcion-cliente.component';

describe('DetalleSuscripcionClienteComponent', () => {
  let component: DetalleSuscripcionClienteComponent;
  let fixture: ComponentFixture<DetalleSuscripcionClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleSuscripcionClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleSuscripcionClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
