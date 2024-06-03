import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleFormatoFacturaComponent } from './detalle-formato-factura.component';

describe('DetalleFormatosFacturasComponent', () => {
  let component: DetalleFormatoFacturaComponent;
  let fixture: ComponentFixture<DetalleFormatoFacturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleFormatoFacturaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleFormatoFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
