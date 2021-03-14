import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaCuotasComponent } from './tabla-cuotas.component';

describe('TablaCuotasComponent', () => {
  let component: TablaCuotasComponent;
  let fixture: ComponentFixture<TablaCuotasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablaCuotasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaCuotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
