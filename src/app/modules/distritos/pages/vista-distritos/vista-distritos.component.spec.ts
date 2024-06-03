import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaDistritosComponent } from './vista-distritos.component';

describe('VistaDistritosComponent', () => {
  let component: VistaDistritosComponent;
  let fixture: ComponentFixture<VistaDistritosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistaDistritosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaDistritosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
