import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaVentasComponent } from './vista-ventas.component';

describe('VistaVentasComponent', () => {
  let component: VistaVentasComponent;
  let fixture: ComponentFixture<VistaVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistaVentasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
