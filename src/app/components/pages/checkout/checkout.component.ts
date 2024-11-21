import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MedicineService } from 'src/app/Services/medicine.service';
import { SharedStatusService } from 'src/app/Services/shared-status.service';
import { MatDialog } from '@angular/material/dialog';
import { OrderconfirmationComponent } from '../orderconfirmation/orderconfirmation.component';
import { FirestoreService } from '../../../Services/firebaseDatabase/firestore.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  billingForm!: FormGroup;
  patientId: string = "";
  constructor(private shareDataService :SharedStatusService, private medicineService: MedicineService, private dialog: MatDialog ,private fb : FormBuilder , private router: Router, private toast : ToastrService, private Firestore : FirestoreService) {
    this.billingForm = this.fb.group({
      deliveryType: ['delivery', [Validators.required, Validators.pattern(/^(pickup|delivery)$/)]],
      patientName: ['', Validators.required],
      mobile: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{10}$/)
        ]
      ],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipcode: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{6}$/)
        ]
      ],
      autoAssign: [true],
      chemistId: [''],
      latitude: ['12.970612'],
      longitude: ['77.6382433'],
    });

  }


  checkout: any;
  shippingCharges: number = 0;
  subtotal: number = 0;
  item: any[] = [];
  totalamoutobject: any;


  ngOnInit(): void {

    this.patientId = localStorage.getItem('patientId') || "";
    this.getdata();
  }

  getdata() {
    this.shareDataService.cartCheckoutResponse$.subscribe((element) => {
      if (element) {
        this.checkout = element;

        this.shippingCharges = this.checkout.data?.shipping_charges;
      } else {
        // console.log("No cart data found.");
      }
    });

    this.shareDataService.subtotal$.subscribe((element) => {
      if (element) {

        this.totalamoutobject = element;
        const totalPrice = this.totalamoutobject.reduce((sum: number, item: any) => {
          return sum + (item.totalprice || 0);
        }, 0);

        this.subtotal = totalPrice;
      } else {
        // console.error('No subtotal found in the element');
      }

    });

  }

  returntohome(){
    this.shareDataService.ClearCart();
    this.shareDataService.clearCartCheckoutResponse();
    this.router.navigate(['/pages/dashboard']);
  }

  openOrderModal(data:any): void {
    this.dialog.open(OrderconfirmationComponent, {
      data:data,
      width: '400px',
      disableClose: true,
      panelClass: 'custom-dialog-container',

    });
  }








  proceedToCheckout(): void {

    if (this.billingForm.valid) {
      this.item = [];

      if (this.checkout?.data?.items?.length) {

        this.checkout.data.items.forEach((ele: any) => {
          if (ele.medicine_id ){
            const item = {
              medicine_id: ele.medicine_id,
              quantity: 1
            };
            // console.log('Item:', item);

            this.item.push(item);
          }else{
            // console.error('No medicine id found in the item');
          }

        });


        const data = {
          items: JSON.stringify(this.item),
          delivery_type: this.billingForm.get('deliveryType')?.value || "delivery",
          patient_name: this.billingForm.get('patientName')?.value,
          mobile: this.billingForm.get('mobile')?.value,
          address: this.billingForm.get('address')?.value,
          city: this.billingForm.get('city')?.value,
          state: this.billingForm.get('state')?.value,
          zipcode: this.billingForm.get('zipcode')?.value,
          auto_assign: this.billingForm.get('autoAssign')?.value || true,
          chemist_id: this.billingForm.get('chemistId')?.value || null,
          latitude: +this.billingForm.get('latitude')?.value || 12.970612,
          longitude: +this.billingForm.get('longitude')?.value || 77.6382433,
          patient_id: this.patientId
        };

        this.medicineService.placeOrder(data).subscribe({
          next: (response) => {
            // console.log("responseresponse",response);
            this.openOrderModal(response)
            this.Firestore.addOrders(response.data?.order_id);
            this.toast.success('Order placed successfully!');
            this.billingForm.reset({ deliveryType: 'delivery', autoAssign: true });
            this.item = [];

          },
          error: (err) => {
            // console.error('Error placing the order:', err);
          }
        });
      } else {
        // console.error('No items found in the cart.');
      }
    } else {
      // console.error('Billing form is invalid.');
      Object.values(this.billingForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsTouched();
        }
      });
    }
  }


}
