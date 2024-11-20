import { Component, OnInit } from '@angular/core';
import { SharedStatusService } from '../../../Services/shared-status.service';
import { MedicineService } from 'src/app/Services/medicine.service';

@Component({
  selector: 'app-addtocart',
  templateUrl: './addtocart.component.html',
  styleUrls: ['./addtocart.component.scss'],
})
export class AddtocartComponent implements OnInit {

  products: any[] = [];
  item: any[] = [];


  constructor(
    private sharedStatusService: SharedStatusService, private medicineService: MedicineService
  ) {}

  ngOnInit(): void {
   this.getdata();

  }

  getdata() {
    this.sharedStatusService.elementSubject$.subscribe((element) => {
      console.log(element);
      this.products = element;
  });
  }


  quantity(event: any){

  }


  couponCode: string = '';

  calculateSubtotal(): number {
    return this.products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
  }

  calculateTotal(): number {
    return this.calculateSubtotal(); // Add any additional charges like tax here
  }

  updateCart(): void {
    alert('Cart updated successfully!');
  }

  applyCoupon(): void {
    if (this.couponCode) {
      alert(`Coupon "${this.couponCode}" applied!`);
    } else {
      alert('Please enter a coupon code.');
    }
  }

  onClickChekcout() {

    this.products.map(ele => {
       let item = {
        quantity: ele.quantity,
        medicine_id: ele.data[0].id
      }
      this.item.push(item);
    })

    let data = {
      latitude: 12.970612,
      longitude: 77.6382433,
      distance: 5,
      items: JSON.stringify(this.item)
    }
    console.log('data', data);

    this.medicineService.chekout(data).subscribe(res => {
      console.log('res', res);
  })

  }

}
