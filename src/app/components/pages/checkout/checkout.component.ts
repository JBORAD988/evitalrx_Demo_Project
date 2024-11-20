import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedStatusService } from 'src/app/Services/shared-status.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  billingForm!: FormGroup;
  constructor(private shareDataService :SharedStatusService, private fb : FormBuilder , private router: Router) {
    this.billingForm = this.fb.group({
      deliveryType: ['delivery'],
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
      patientId: ['']
    });
  }


  checkout: any;
  shippingCharges: number = 0;
  subtotal: number = 0;

  ngOnInit(): void {

    this.getdata();


  }

  getdata() {
    this.shareDataService.cartCheckoutResponse$.subscribe((element) => {
      this.checkout = element;
      console.log(this.checkout);

      let totalMrp = this.checkout.data?.items.reduce((total:any, item:any) => {
        if (item.mrp) {
          total += item.mrp;
        }
        return total;
      }, 0);

      console.log("Total MRP:", totalMrp);

      this.subtotal = totalMrp;
      this.shippingCharges = this.checkout.data?.shipping_charges;



  });
  }

  returntohome(){
    this.shareDataService.ClearCart();
    this.shareDataService.clearCartCheckoutResponse();
    this.router.navigate(['/pages/dashboard']);
  }








  proceedToCheckout(): void {
    if (this.billingForm.valid) {
      console.log('Proceeding to checkout with data:', this.billingForm.value);

    }
  }

}
