import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteCobrosComponent } from './reporte-cobros.component';

describe('ReporteCobrosComponent', () => {
  let component: ReporteCobrosComponent;
  let fixture: ComponentFixture<ReporteCobrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteCobrosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteCobrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
