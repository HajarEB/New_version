import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUpdateAppointmentDialogComponent } from './admin-update-appointment-dialog.component';

describe('AdminUpdateAppointmentDialogComponent', () => {
  let component: AdminUpdateAppointmentDialogComponent;
  let fixture: ComponentFixture<AdminUpdateAppointmentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUpdateAppointmentDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUpdateAppointmentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
