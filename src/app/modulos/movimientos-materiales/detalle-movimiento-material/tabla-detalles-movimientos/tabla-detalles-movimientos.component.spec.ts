import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaDetallesMovimientosComponent } from './tabla-detalles-movimientos.component';

describe('TablaDetalleMovimientoComponent', () => {
  let component: TablaDetallesMovimientosComponent;
  let fixture: ComponentFixture<TablaDetallesMovimientosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablaDetallesMovimientosComponent]
    });
    fixture = TestBed.createComponent(TablaDetallesMovimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
