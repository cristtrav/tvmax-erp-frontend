import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaMovimientosMaterialesComponent } from './vista-movimientos-materiales.component';

describe('VistaMovimientosMaterialesComponent', () => {
  let component: VistaMovimientosMaterialesComponent;
  let fixture: ComponentFixture<VistaMovimientosMaterialesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaMovimientosMaterialesComponent]
    });
    fixture = TestBed.createComponent(VistaMovimientosMaterialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
