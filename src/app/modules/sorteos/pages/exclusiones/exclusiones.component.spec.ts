import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExclusionesComponent } from './exclusiones.component';

describe('ExclusionesComponent', () => {
  let component: ExclusionesComponent;
  let fixture: ComponentFixture<ExclusionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExclusionesComponent]
    });
    fixture = TestBed.createComponent(ExclusionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
