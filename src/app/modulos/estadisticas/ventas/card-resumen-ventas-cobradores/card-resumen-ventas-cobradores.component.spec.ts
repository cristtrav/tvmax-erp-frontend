import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardResumenVentasCobradoresComponent } from './card-resumen-ventas-cobradores.component';

describe('CardResumenVentasCobradoresComponent', () => {
  let component: CardResumenVentasCobradoresComponent;
  let fixture: ComponentFixture<CardResumenVentasCobradoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardResumenVentasCobradoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardResumenVentasCobradoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
