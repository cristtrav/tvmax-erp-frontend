import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleCobradorComponent } from './detalle-cobrador.component';

describe('DetalleCobradorComponent', () => {
  let component: DetalleCobradorComponent;
  let fixture: ComponentFixture<DetalleCobradorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleCobradorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleCobradorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
