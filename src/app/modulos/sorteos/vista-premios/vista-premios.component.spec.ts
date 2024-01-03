import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaPremiosComponent } from './vista-premios.component';

describe('VistaPremiosComponent', () => {
  let component: VistaPremiosComponent;
  let fixture: ComponentFixture<VistaPremiosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaPremiosComponent]
    });
    fixture = TestBed.createComponent(VistaPremiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
