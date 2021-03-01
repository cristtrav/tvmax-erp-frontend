import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleDistritoComponent } from './detalle-distrito.component';

describe('DetalleDistritoComponent', () => {
  let component: DetalleDistritoComponent;
  let fixture: ComponentFixture<DetalleDistritoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleDistritoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleDistritoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
