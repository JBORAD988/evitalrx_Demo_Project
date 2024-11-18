import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { evitalrxApi } from 'src/app/Api/evitalrxApi';

@Injectable({
  providedIn: 'root'
})
export class MedicineService {
  constructor(private http: HttpClient ) {


  }

  private medicineUrl = "https://dev-api.evitalrx.in/v1/fulfillment/medicines/search";
  private medicineInfoUrl = "https://dev-api.evitalrx.in/v1/fulfillment/medicines/view";

  getMedicine(searchTerm: string): Observable<any> {
    const formData = new FormData();
    formData.append('apikey', evitalrxApi.evitalConfig.apiKey);
    formData.append('searchstring', searchTerm);

    return this.http.post(this.medicineUrl, formData);
  }



  getMedicineInfo(searchTerm: any): Observable<any> {
    const formData = new FormData();
    formData.append('apikey', evitalrxApi.evitalConfig.apiKey);
    formData.append('medicine_ids', searchTerm);

    return this.http.post(this.medicineInfoUrl, formData);
  }


}
