import { Component, OnInit } from '@angular/core';
import { SharedStatusService } from '../../../Services/shared-status.service';
import { MedicineService } from 'src/app/Services/medicine.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addtocart',
  templateUrl: './addtocart.component.html',
  styleUrls: ['./addtocart.component.scss'],
})
export class AddtocartComponent implements OnInit {

  products: any[] = [];
  item: any[] = [];
  productPrice: any[] = [];

  constructor(
    private sharedStatusService: SharedStatusService, private medicineService: MedicineService,
    private router: Router
  ) {


  }

  ngOnInit(): void {
   this.getdata();

  }

  getdata() {
    this.sharedStatusService.elementSubject$.subscribe((element) => {
      console.log(element);
      this.products = element;

      this.products.forEach((element) => {
        this.productPrice.push({ id : element.data[0].id ,totalprice: element.data[0].mrp });

      });
      this.sharedStatusService.sendSubtotal(this.productPrice);

  });
  }

returntohome() {
  this.router.navigate(['/pages/dashboard']);
}

ClearAlldata(){
    this.sharedStatusService.ClearCart();
    this.router.navigate(['/pages/dashboard']);
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

    this.medicineService.chekout(data).subscribe(res => {
      const data = res ;
      this.sharedStatusService.sendCartCheckoutResponse(data);
      this.router.navigate(['/pages/checkout']);
  })

  }

  quantityChange(products: any, id: any) {
    const productIndex = this.productPrice.findIndex((item) => item.id === id);

    if (productIndex !== -1) {
      this.productPrice[productIndex].totalprice = products;
      console.log(`Updated totalprice for id: ${id}, new totalprice: ${products}`);
    } else {
      this.productPrice.push({ ...products, id });
      console.log(`Added new product:`, products);
    }

     this.sharedStatusService.sendSubtotal(this.productPrice);


    console.log('Updated productPrice:', this.productPrice);
  }

  preventNegative(event: KeyboardEvent): void {
    if (event.key === '-' || event.key === '+' || event.key === 'e') {
      event.preventDefault();
    }
  }

}
