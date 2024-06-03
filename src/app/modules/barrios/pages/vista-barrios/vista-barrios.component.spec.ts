import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaBarriosComponent } from './vista-barrios.component';

describe('VistaBarriosComponent', () => {
  let component: VistaBarriosComponent;
  let fixture: ComponentFixture<VistaBarriosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistaBarriosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaBarriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
