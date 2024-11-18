import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MedicineService {
  constructor(private http: HttpClient) { }

  private apiKey = "wFIMP75eG1sQEh8vVAdXykgzF4mLhDw3";
  private medicineUrl = "https://dev-api.evitalrx.in/v1/fulfillment/medicines/search";
  private medicineInfoUrl = "https://dev-api.evitalrx.in/v1/fulfillment/medicines/view";

  getMedicine(searchTerm: string): Observable<any> {
    const formData = new FormData();
    formData.append('apikey', this.apiKey);
    formData.append('searchstring', searchTerm);

    return this.http.post(this.medicineUrl, formData);
  }



  getMedicineInfo(searchTerm: any): Observable<any> {
    const formData = new FormData();
    formData.append('apikey', this.apiKey);
    formData.append('medicine_ids', searchTerm);

    return this.http.post(this.medicineInfoUrl, formData);
  }


}
