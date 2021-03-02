import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleBarrioComponent } from './detalle-barrio.component';

describe('DetalleBarrioComponent', () => {
  let component: DetalleBarrioComponent;
  let fixture: ComponentFixture<DetalleBarrioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleBarrioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleBarrioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
