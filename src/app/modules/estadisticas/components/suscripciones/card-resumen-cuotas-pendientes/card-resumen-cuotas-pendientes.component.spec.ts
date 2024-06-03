import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardResumenCuotasPendientesComponent } from './card-resumen-cuotas-pendientes.component';

describe('CardResumenCuotasPendientesComponent', () => {
  let component: CardResumenCuotasPendientesComponent;
  let fixture: ComponentFixture<CardResumenCuotasPendientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardResumenCuotasPendientesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardResumenCuotasPendientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
