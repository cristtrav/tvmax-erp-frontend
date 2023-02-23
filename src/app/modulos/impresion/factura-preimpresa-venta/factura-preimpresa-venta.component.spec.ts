import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturaPreimpresaVentaComponent } from './factura-preimpresa-venta.component';

describe('FacturaPreimpresaVentaComponent', () => {
  let component: FacturaPreimpresaVentaComponent;
  let fixture: ComponentFixture<FacturaPreimpresaVentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacturaPreimpresaVentaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacturaPreimpresaVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
