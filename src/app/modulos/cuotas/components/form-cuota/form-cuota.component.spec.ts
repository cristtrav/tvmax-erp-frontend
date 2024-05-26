import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCuotaComponent } from './form-cuota.component';

describe('FormCuotaComponent', () => {
  let component: FormCuotaComponent;
  let fixture: ComponentFixture<FormCuotaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormCuotaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCuotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
