import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardResumenEstadosComponent } from './card-resumen-estados.component';

describe('CardResumenEstadosComponent', () => {
  let component: CardResumenEstadosComponent;
  let fixture: ComponentFixture<CardResumenEstadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardResumenEstadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardResumenEstadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
