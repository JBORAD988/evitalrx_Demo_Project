import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ViewdetailsComponent } from '../viewdetails/viewdetails.component';
import { SharedStatusService } from '../../../Services/shared-status.service';
import { MedicineService } from '../../../Services/medicine.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orderconfirmation',
  templateUrl: './orderconfirmation.component.html',
  styleUrls: ['./orderconfirmation.component.scss']
})
export class OrderconfirmationComponent {


  constructor(
    private router: Router,
    private SharedStatusService : SharedStatusService,
    private MedicineService : MedicineService,
    public dialogRef: MatDialogRef<ViewdetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

   this.SharedStatusService.patientId$.subscribe((element) => {
      if (element) {
        this.data.patientId = element;
        this.MedicineService.viewPatient(element).subscribe((response) => {
          this.data = {
            ...this.data , patientName : response.data[0].firstname + ' ' + response.data[0].lastname
          }
        }
        );
      }

    });


    }

  closePopup(): void {
    this.SharedStatusService.ClearCart();
    this.SharedStatusService.clearCartCheckoutResponse();
    this.dialogRef.close();
    this.router.navigate(['/pages/dashboard']);
  }




  }
