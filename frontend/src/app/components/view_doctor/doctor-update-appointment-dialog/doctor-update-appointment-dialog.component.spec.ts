import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorUpdateAppointmentDialogComponent } from './doctor-update-appointment-dialog.component';

describe('DoctorUpdateAppointmentDialogComponent', () => {
  let component: DoctorUpdateAppointmentDialogComponent;
  let fixture: ComponentFixture<DoctorUpdateAppointmentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorUpdateAppointmentDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorUpdateAppointmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
