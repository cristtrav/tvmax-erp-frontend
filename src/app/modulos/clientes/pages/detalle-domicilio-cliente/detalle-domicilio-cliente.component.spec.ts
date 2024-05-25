import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleDomicilioClienteComponent } from './detalle-domicilio-cliente.component';

describe('DetalleDomicilioClienteComponent', () => {
  let component: DetalleDomicilioClienteComponent;
  let fixture: ComponentFixture<DetalleDomicilioClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleDomicilioClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleDomicilioClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
