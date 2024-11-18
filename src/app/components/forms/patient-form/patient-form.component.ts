import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from 'src/app/Services/firebaseDatabase/firestore.service';
import { MedicineService } from 'src/app/Services/medicine.service';

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss']
})
export class PatientFormComponent {
  patientForm!: FormGroup;

  constructor(private fb: FormBuilder, private medicineService: MedicineService, private firestoreService: FirestoreService) {}

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
      // console.log('Form Submitted:', this.patientForm.value);

      this.medicineService.addPatient(this.patientForm.value).subscribe((response) => {
        console.log('Response:', response);
        this.firestoreService.addPatient(response.data.patient_id);
      })

    } else {
      console.log('Form is invalid');
    }
  }
}
