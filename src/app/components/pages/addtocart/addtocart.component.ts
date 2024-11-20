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
  });
  }

returntohome() {
  // this.sharedStatusService.ClearCart();
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

}
