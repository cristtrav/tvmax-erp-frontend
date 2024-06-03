import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleUsuarioDepositoComponent } from './detalle-usuario-deposito.component';

describe('DetalleUsuarioDepositoComponent', () => {
  let component: DetalleUsuarioDepositoComponent;
  let fixture: ComponentFixture<DetalleUsuarioDepositoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleUsuarioDepositoComponent]
    });
    fixture = TestBed.createComponent(DetalleUsuarioDepositoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
