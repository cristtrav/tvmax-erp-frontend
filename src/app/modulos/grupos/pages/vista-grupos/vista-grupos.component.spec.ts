import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaGruposComponent } from './vista-grupos.component';

describe('VistaGruposComponent', () => {
  let component: VistaGruposComponent;
  let fixture: ComponentFixture<VistaGruposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistaGruposComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaGruposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
