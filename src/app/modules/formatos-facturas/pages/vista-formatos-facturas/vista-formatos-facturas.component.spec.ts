import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaFormatosFacturasComponent } from './vista-formatos-facturas.component';

describe('VistaFormatosFacturasComponent', () => {
  let component: VistaFormatosFacturasComponent;
  let fixture: ComponentFixture<VistaFormatosFacturasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistaFormatosFacturasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VistaFormatosFacturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
