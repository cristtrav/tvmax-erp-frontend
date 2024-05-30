import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortearComponent } from './sortear.component';

describe('SortearComponent', () => {
  let component: SortearComponent;
  let fixture: ComponentFixture<SortearComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SortearComponent]
    });
    fixture = TestBed.createComponent(SortearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
