import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaDetalleEstadoComponent } from './tabla-detalle-estado.component';

describe('TablaDetalleEstadoComponent', () => {
  let component: TablaDetalleEstadoComponent;
  let fixture: ComponentFixture<TablaDetalleEstadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaDetalleEstadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaDetalleEstadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
