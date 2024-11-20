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

  addPatient(patient: any): Observable<any> {


    const formData = new FormData();
    formData.append('apikey', evitalrxApi.evitalConfig.apiKey);
    formData.append('mobile', patient.mobile);
    formData.append('first_name', patient.first_name);
    formData.append('last_name', patient.last_name);
    formData.append('zipcode', patient.zipcode);
    formData.append('dob', patient.dob);
    formData.append('gender', patient.gender);
    formData.append('blood_group', patient.blood_group);

    console.log('formData', formData.getAll);


    return this.http.post('https://dev-api.evitalrx.in/v1/fulfillment/patients/add', formData);
  }

  viewPatient(patient_id: any): Observable<any> {
    const formData = new FormData();
    formData.append('apikey', evitalrxApi.evitalConfig.apiKey);
    formData.append('patient_id', patient_id);

    return this.http.post('https://dev-api.evitalrx.in/v1/fulfillment/patients/view', formData);
  }

  chekout(data: any): Observable<any> {
    const formData = new FormData();
    formData.append('apikey', evitalrxApi.evitalConfig.apiKey);
    formData.append('items', data.items);
    formData.append('latitude', data.latitude);
    formData.append('longitude', data.longitude);
    formData.append('distance', data.distance);

    return this.http.post('https://dev-api.evitalrx.in/v1/fulfillment/orders/checkout', formData);
  }


}
