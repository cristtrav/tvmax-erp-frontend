import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFiltroMovimientosComponent } from './form-filtro-movimientos.component';

describe('FormFiltroMovimientosComponent', () => {
  let component: FormFiltroMovimientosComponent;
  let fixture: ComponentFixture<FormFiltroMovimientosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormFiltroMovimientosComponent]
    });
    fixture = TestBed.createComponent(FormFiltroMovimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
