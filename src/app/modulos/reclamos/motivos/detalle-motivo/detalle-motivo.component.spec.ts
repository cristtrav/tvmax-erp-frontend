import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleMotivoComponent } from './detalle-motivo.component';

describe('DetalleMotivoComponent', () => {
  let component: DetalleMotivoComponent;
  let fixture: ComponentFixture<DetalleMotivoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleMotivoComponent]
    });
    fixture = TestBed.createComponent(DetalleMotivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
