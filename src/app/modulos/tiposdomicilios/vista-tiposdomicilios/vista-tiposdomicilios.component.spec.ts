import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaTiposdomiciliosComponent } from './vista-tiposdomicilios.component';

describe('VistaTiposdomiciliosComponent', () => {
  let component: VistaTiposdomiciliosComponent;
  let fixture: ComponentFixture<VistaTiposdomiciliosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistaTiposdomiciliosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaTiposdomiciliosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
