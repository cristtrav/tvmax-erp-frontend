import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleTimbradoComponent } from './detalle-timbrado.component';

describe('DetalleTimbradoComponent', () => {
  let component: DetalleTimbradoComponent;
  let fixture: ComponentFixture<DetalleTimbradoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleTimbradoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleTimbradoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
