import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleSorteoComponent } from './detalle-sorteo.component';

describe('DetalleSorteoComponent', () => {
  let component: DetalleSorteoComponent;
  let fixture: ComponentFixture<DetalleSorteoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleSorteoComponent]
    });
    fixture = TestBed.createComponent(DetalleSorteoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
