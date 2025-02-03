import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTimbradoTalonarioComponent } from './detalle-timbrado-talonario.component';

describe('DetalleTimbradoTalonarioComponent', () => {
  let component: DetalleTimbradoTalonarioComponent;
  let fixture: ComponentFixture<DetalleTimbradoTalonarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalleTimbradoTalonarioComponent]
    });
    fixture = TestBed.createComponent(DetalleTimbradoTalonarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
