import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaDomiciliosComponent } from './vista-domicilios.component';

describe('VistaDomiciliosComponent', () => {
  let component: VistaDomiciliosComponent;
  let fixture: ComponentFixture<VistaDomiciliosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistaDomiciliosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaDomiciliosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
