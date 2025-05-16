import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientUpdateAppointmentDialogComponent } from './patient-update-appointment-dialog.component';

describe('PatientUpdateAppointmentDialogComponent', () => {
  let component: PatientUpdateAppointmentDialogComponent;
  let fixture: ComponentFixture<PatientUpdateAppointmentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientUpdateAppointmentDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientUpdateAppointmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
