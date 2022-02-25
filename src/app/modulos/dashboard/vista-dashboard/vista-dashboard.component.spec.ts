import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaDashboardComponent } from './vista-dashboard.component';

describe('VistaDashboardComponent', () => {
  let component: VistaDashboardComponent;
  let fixture: ComponentFixture<VistaDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistaDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
