import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleDepartamentoComponent } from './detalle-departamento.component';

describe('DetalleDepartamentoComponent', () => {
  let component: DetalleDepartamentoComponent;
  let fixture: ComponentFixture<DetalleDepartamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleDepartamentoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleDepartamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
