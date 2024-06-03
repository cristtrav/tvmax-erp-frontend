import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleSuscripcionComponent } from './detalle-suscripcion.component';

describe('DetalleSuscripcionComponent', () => {
  let component: DetalleSuscripcionComponent;
  let fixture: ComponentFixture<DetalleSuscripcionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleSuscripcionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleSuscripcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
