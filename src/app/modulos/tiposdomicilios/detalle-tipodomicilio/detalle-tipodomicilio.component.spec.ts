import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTipodomicilioComponent } from './detalle-tipodomicilio.component';

describe('DetalleTipodomicilioComponent', () => {
  let component: DetalleTipodomicilioComponent;
  let fixture: ComponentFixture<DetalleTipodomicilioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleTipodomicilioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTipodomicilioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
