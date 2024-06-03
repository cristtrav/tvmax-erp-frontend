import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaUsuariosComponent } from './vista-usuarios.component';

describe('VistaUsuariosComponent', () => {
  let component: VistaUsuariosComponent;
  let fixture: ComponentFixture<VistaUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistaUsuariosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
