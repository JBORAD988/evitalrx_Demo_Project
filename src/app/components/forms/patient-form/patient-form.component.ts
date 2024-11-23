import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from 'src/app/Services/firebaseDatabase/firestore.service';
import { MedicineService } from 'src/app/Services/medicine.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ViewdetailsComponent } from '../../pages/viewdetails/viewdetails.component';
import { ToastrService } from 'ngx-toastr';
import { SharedStatusService } from 'src/app/Services/shared-status.service';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss']
})
export class PatientFormComponent {
  patientForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private medicineService: MedicineService,
    private toster: ToastrService,
    private sharedService: SharedStatusService,
    private firestoreService: FirestoreService,
    public dialogRef: MatDialogRef<ViewdetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
 }

  ngOnInit(): void {
    this.patientForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(2)]],
      last_name: ['', [Validators.required, Validators.minLength(2)]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      zipcode: ['', [Validators.required, Validators.pattern('^[0-9]{5,6}$')]],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      blood_group: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.patientForm.valid) {

      this.toster.success('Patient added successfully');
      this.medicineService.addPatient(this.patientForm.value).subscribe((response) => {
        console.log('Response:', response);
        this.firestoreService.addPatient(response.data.patient_id);
        this.sharedService.sendPatient(true);
      })

      this.onCancel()

    } else {
      this.toster.error('Form is invalid');

    }
  }


  onCancel(): void {
    this.patientForm.reset();
    this.dialogRef.close();

  }
}
