import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuotasPendientesComponent } from './cuotas-pendientes.component';

describe('CuotasPendientesComponent', () => {
  let component: CuotasPendientesComponent;
  let fixture: ComponentFixture<CuotasPendientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuotasPendientesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CuotasPendientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
