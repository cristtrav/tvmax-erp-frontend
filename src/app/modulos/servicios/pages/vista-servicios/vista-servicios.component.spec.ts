import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaServiciosComponent } from './vista-servicios.component';

describe('VistaServiciosComponent', () => {
  let component: VistaServiciosComponent;
  let fixture: ComponentFixture<VistaServiciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistaServiciosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
