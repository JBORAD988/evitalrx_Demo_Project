import { Component , OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MedicineService } from 'src/app/Services/medicine.service';
import { ViewdetailsComponent } from '../viewdetails/viewdetails.component';
import { PatientFormComponent } from '../../forms/patient-form/patient-form.component';
import { FirestoreService } from 'src/app/Services/firebaseDatabase/firestore.service';
import { ToastrService } from 'ngx-toastr';
import { SharedStatusService } from 'src/app/Services/shared-status.service';
import { share } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  patientForm!: FormGroup;
  dataSource: any;
  cartData: any[] = [];
  cardDataIds:any[]=[];
  isAlreadyInCart:any;
  displayedColumns: string[] = ['position', 'medicine_name', 'manufacturer_name', 'packing_size', 'price', 'available_for_patient', 'Action'];
  dialogData: any;
  suggestions : string = '';
  mostSearchedMedicines = ['Paracetamol', 'Dolo', 'Beta', 'Zifi', 'Thyrox', 'Ltk'];
  medicine_id: any[] = [];
  patient_name: any[] = [];
  selectedMedicine: string = '';

  constructor(
    public dialog: MatDialog,
    private medicineService: MedicineService,
    private fireStroreService: FirestoreService,
    private toastr: ToastrService,
    private sharedStatusService: SharedStatusService,
    private fb: FormBuilder
  ) {

    this.patientForm = this.fb.group({
      patientName: ['',Validators.required],
    });


   }


  ngOnInit(): void {
    this.getPatients();
  }

  onSearch(event: any): void {

    const searchTerm = event.target.value;
    this.selectedMedicine = searchTerm;
    this.medicineService.getMedicine(searchTerm).subscribe({
      next: (res) => {
        const data = res.data;
        const Suggestions = data.did_you_mean_result;
if(Suggestions.length > 0){
  this.suggestions = Suggestions[0].medicine_name;
  this.toastr.info('Did you mean: ' + Suggestions[0].
  medicine_name);
}else{
        this.dataSource = res.data.result;
}

      },
      error: (err) => {
        // console.error('Error fetching medicines: ', err);
      }
    });

  }


  buttonSearch(medicine: string): void {
this.selectedMedicine = medicine;
this.suggestions = '';
    this.medicineService.getMedicine(medicine).subscribe({
      next: (res) => {

        this.dataSource = res.data.result;
      },
      error: (err) => {
        // console.error('Error fetching medicines: ', err);
      }
    });
  }


  openDialog(element: any): void {
    this.medicine_id = [];
    this.medicine_id.push(element.medicine_id)


    let id = JSON.stringify(this.medicine_id)
    this.medicineService.getMedicineInfo(id).subscribe(res => {
      if(res.data.length === 0){
        this.toastr.info('No data found');
        return;
      }
      this.dialogData = res.data[0];

      const dialogRef = this.dialog.open(ViewdetailsComponent, {
        data: this.dialogData,
      });

      dialogRef.afterClosed().subscribe(result => {
      });
    });
  }

  AddtoCart(element: any): void {

    this.cardDataIds = [element.medicine_id];
    const id = JSON.stringify(this.cardDataIds);
    const availableForPatient = element.available_for_patient?.toLowerCase() === 'yes';

    const storedCartData = localStorage.getItem('cartCheckoutResponse');
    if (storedCartData) {
      this.cartData = JSON.parse(storedCartData);
    }

    this.medicineService.getMedicineInfo(id).subscribe({
      next: (res) => {
if(res.data.length === 0){

  this.toastr.error('No data for available');
return
}

        if (Array.isArray(this.cartData)) {
           this.isAlreadyInCart = this.cartData.some((item) =>
            item.data[0]?.id === res.data[0]?.id
          );
        } else {
          this.cartData = [];
          }

        if (!this.isAlreadyInCart) {
          this.cartData.push({ ...res, quantity: 1 });
        }
        if (availableForPatient  && !this.isAlreadyInCart) {
          this.toastr.success('Added to cart');
          this.sharedStatusService.sendElement(this.cartData);
        } else if(!availableForPatient){
          this.cartData = this.cartData.filter((item) => item.data[0]?.id !== res.id);
          this.toastr.error('Not available for patient');
        }else {
          this.toastr.info('Already in cart');
        }
      },
      error: (err) => {
        this.toastr.error('Failed to add to cart. Please try again.');
      },
    });
  }







  onSelectionChange(event: any): void {
    const patientid = event.value.patient_id;
    this.sharedStatusService.sendPatientId(patientid);
  }

  addPatient(): void {
    const dialogRef = this.dialog.open(PatientFormComponent, {
    });
  }

  async getPatients(): Promise<void> {
    try {
      const patientIds = await this.fireStroreService.getPatientIds();
        const patientPromises = patientIds.map((element: any) =>
        this.medicineService.viewPatient(element).toPromise()
      );
        const patientResponses = await Promise.all(patientPromises);

      this.patient_name = patientResponses.map((res: any) => ({
        patient_id: res.data[0].patient_id,
        patient_name: res.data[0].firstname,
      }));
        this.firstLoad();
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  }

  firstLoad(): void {
    if (this.patient_name.length > 0) {
      this.patientForm.patchValue({
        patientName: this.patient_name[0],
      });
        this.sharedStatusService.sendPatientId(this.patient_name[0].patient_id);
    }
  }


}
