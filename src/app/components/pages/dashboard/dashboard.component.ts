import { Component , OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MedicineService } from 'src/app/Services/medicine.service';
import { ViewdetailsComponent } from '../viewdetails/viewdetails.component';
import { PatientFormComponent } from '../../forms/patient-form/patient-form.component';
import { FirestoreService } from 'src/app/Services/firebaseDatabase/firestore.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  dataSource: any;
  displayedColumns: string[] = ['position', 'medicine_name', 'manufacturer_name', 'packing_size', 'price', 'available_for_patient', 'Action'];
  dialogData: any;
  medicine_id: any[] = [];
  patient_name: any[] = [];

  constructor(
    public dialog: MatDialog,
    private medicineService: MedicineService,
    private fireStroreService: FirestoreService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getPatients();
  }

  onSearch(event: any): void {

    const searchTerm = event.target.value;
    this.medicineService.getMedicine(searchTerm).subscribe({
      next: (res) => {
        this.dataSource = res.data.result;
      },
      error: (err) => {
        console.error('Error fetching medicines: ', err);
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
    console.log('element', element);
  }




  onSelectionChange(event: any): void {
    const selectedValue = event.value;
    console.log('Selected:', selectedValue);

  }

  addPatient(): void {
    console.log('Add Patient option clicked');
    const dialogRef = this.dialog.open(PatientFormComponent, {
    });
  }

  getPatients(): void {
    this.fireStroreService.getPatientIds().then((data) => {
      data.forEach((element: any) => {
        this.medicineService.viewPatient(element).subscribe((res) => {
          console.log(res);
          this.patient_name.push(res.data[0].firstname);
        } );
      });
    } ).catch((error) => {
      console.error('Error fetching patient IDs:', error);
    });
  }


}
