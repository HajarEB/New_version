import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUpdatePatientDialogComponent } from './admin-update-patient-dialog.component';

describe('AdminUpdatePatientDialogComponent', () => {
  let component: AdminUpdatePatientDialogComponent;
  let fixture: ComponentFixture<AdminUpdatePatientDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUpdatePatientDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUpdatePatientDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
