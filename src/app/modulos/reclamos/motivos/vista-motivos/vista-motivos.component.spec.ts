import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaMotivosComponent } from './vista-motivos.component';

describe('VistaMotivosComponent', () => {
  let component: VistaMotivosComponent;
  let fixture: ComponentFixture<VistaMotivosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaMotivosComponent]
    });
    fixture = TestBed.createComponent(VistaMotivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
