import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaUsuariosDepositosComponent } from './vista-usuarios-depositos.component';

describe('VistaUsuariosDepositosComponent', () => {
  let component: VistaUsuariosDepositosComponent;
  let fixture: ComponentFixture<VistaUsuariosDepositosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaUsuariosDepositosComponent]
    });
    fixture = TestBed.createComponent(VistaUsuariosDepositosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
