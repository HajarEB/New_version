import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientNewAppointmentComponent } from './patient-new-appointment.component';

describe('PatientNewAppointmentComponent', () => {
  let component: PatientNewAppointmentComponent;
  let fixture: ComponentFixture<PatientNewAppointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientNewAppointmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientNewAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
