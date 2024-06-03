import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaAuditoriaComponent } from './vista-auditoria.component';

describe('VistaAuditoriaComponent', () => {
  let component: VistaAuditoriaComponent;
  let fixture: ComponentFixture<VistaAuditoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistaAuditoriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaAuditoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
