import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUpdateDoctorDialogComponent } from './admin-update-doctor-dialog.component';

describe('AdminUpdateDoctorDialogComponent', () => {
  let component: AdminUpdateDoctorDialogComponent;
  let fixture: ComponentFixture<AdminUpdateDoctorDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUpdateDoctorDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUpdateDoctorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
