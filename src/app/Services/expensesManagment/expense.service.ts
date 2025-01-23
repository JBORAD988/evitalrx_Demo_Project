import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  constructor(private https: HttpClient) { }
  private expenseUrladd = "https://staging.evitalrx.in:3000/v3/expenses";
  private accesstoken = 'hh29odfyf46o6tfh';
  private deviceId = 'bf17deab-7b9c-46bc-b948-7c048c78d723'
  private chemist_id = 1185;
  private login_parent_id = 1185;

  private getdata(page: number, startDate?: Date, endDate?: Date): Observable<any> {
    const today = new Date();

    const defaultStartDate = startDate ? startDate.toISOString().split('T')[0] : today.toISOString().split('T')[0];
    const defaultEndDate = endDate ? endDate.toISOString().split('T')[0] : today.toISOString().split('T')[0];

    const listdata: any = {
      "page": page,
      "start_date": defaultStartDate,
      "end_date": defaultEndDate,
      "chemist_id": this.chemist_id,
      "login_parent_id": this.login_parent_id,
      "accesstoken": this.accesstoken,
      "device_id": this.deviceId
    }
    const headers = { 'Content-Type': 'application/json' };
    return this.https.post('https://staging.evitalrx.in:3000/v3/expenses/list', listdata, { headers });
  }

  private addData(data: any): Observable<any> {


    const transactionDate = data.transactionDate.toISOString().split('T')[0];
    const paymentDate = data.paymentDate
      ? data.paymentDate.toISOString().split('T')[0]
      : transactionDate;

      let chequeDate = data.chequeDate
      ? data.chequeDate.toISOString().split('T')[0]
      : transactionDate;


    const formData = new FormData();
    formData.append('accesstoken', this.accesstoken);
    formData.append('invoice_photo', data.document);
    formData.append('category_id', data.category);
    formData.append('expense_date', transactionDate);
    formData.append('payment_method_id', data.paymentMode);
    formData.append('amount', data.amount);
    formData.append('remark', data.remarks);
    formData.append('account_id', data.account_id ? data.account_id : 0);
    formData.append('cheque_date', chequeDate);
    formData.append('reference_no', data.referenceNo);
    formData.append('payment_date', paymentDate);
    formData.append('transaction_type', data.transaction_type);
    formData.append('party_name', data.party_name);
    formData.append('chemist_id', this.chemist_id.toString());
    formData.append('device_id', this.deviceId);
    formData.append('login_parent_id', this.login_parent_id.toString());

    if (data.hasGST) {
      formData.append('gstn_number', data.gstnNumber);
      formData.append('gst_percentage', data.gstPercentage);
      if(data.hsnCode){
        formData.append('hsn_sac_code', data.hsnCode);
      }else{
        formData.append('hsn_sac_code', '123456');
      }
    }

    return this.https.post(`${this.expenseUrladd}/add`, formData);
  }
   private deleteData(id: number): Observable<any> {

      const requestBody = {
        accesstoken: this.accesstoken,
        device_id: this.deviceId,
        login_parent_id: this.login_parent_id,
        chemist_id: this.chemist_id,
        expense_id: id
      };
      const headers = { 'Content-Type': 'application/json' };

      return this.https.post(
        'https://staging.evitalrx.in:3000/v3/expenses/delete',
        requestBody,
        { headers }
      );
    }


    postData(page?: number, startDate?: Date, endDate?: Date, payload?: any, id?: number): Observable<any> {

      const headers = { 'Content-Type': 'application/json' };
      const today = new Date();
      const defaultStartDate = startDate ? startDate.toISOString().split('T')[0] : today.toISOString().split('T')[0];
      const defaultEndDate = endDate ? endDate.toISOString().split('T')[0] : today.toISOString().split('T')[0];

      const loadListPayload: any = {
        "page": page,
        "start_date": defaultStartDate,
        "end_date": defaultEndDate,
        "chemist_id": this.chemist_id,
        "login_parent_id": this.login_parent_id,
        "accesstoken": this.accesstoken,
        "device_id": this.deviceId
      };

      const transactionDate = payload?.transactionDate?.toISOString().split('T')[0];
      const paymentDate = payload?.paymentDate
        ? payload.paymentDate.toISOString().split('T')[0]
        : transactionDate;

      let chequeDate = payload?.chequeDate
        ? payload.chequeDate.toISOString().split('T')[0]
        : transactionDate;

      if (id) {
        const requestBody = {
          accesstoken: this.accesstoken,
          device_id: this.deviceId,
          login_parent_id: this.login_parent_id,
          chemist_id: this.chemist_id,
          expense_id: id
        };

        return this.https.post(`${this.expenseUrladd}/delete`, requestBody);
      }else if (payload) {
        const formPayload = new FormData();
        formPayload.append('accesstoken', this.accesstoken);
        formPayload.append('invoice_photo', payload.document);
        formPayload.append('category_id', payload.category);
        formPayload.append('expense_date', transactionDate);
        formPayload.append('payment_method_id', payload.paymentMode);
        formPayload.append('amount', payload.amount);
        formPayload.append('remark', payload.remarks);
        formPayload.append('account_id', payload.account_id ? payload.account_id : 0);
        formPayload.append('cheque_date', chequeDate);
        formPayload.append('reference_no', payload.referenceNo);
        formPayload.append('payment_date', paymentDate);
        formPayload.append('transaction_type', payload.transaction_type);
        formPayload.append('party_name', payload.party_name);
        formPayload.append('chemist_id', this.chemist_id.toString());
        formPayload.append('device_id', this.deviceId);
        formPayload.append('login_parent_id', this.login_parent_id.toString());

    if (payload.hasGST) {
      formPayload.append('gstn_number', payload.gstnNumber);
      formPayload.append('gst_percentage', payload.gstPercentage);
      if(payload.hsnCode){
        formPayload.append('hsn_sac_code', payload.hsnCode);
      }else{
        formPayload.append('hsn_sac_code', '123456');
      }
    }

        return this.https.post(`${this.expenseUrladd}/add`, formPayload);

      }

      return this.https.post('https://staging.evitalrx.in:3000/v3/expenses/list', loadListPayload, { headers });

  }






}
