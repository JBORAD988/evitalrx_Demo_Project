import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  constructor(private https: HttpClient) { }

  private expenseUrladd = "https://staging.evitalrx.in:3000/v3/expenses/add";

  private accesstoken = 'hh29odfyf46o6tfh';
  private deviceId = 'bf17deab-7b9c-46bc-b948-7c048c78d723'
  private chemist_id = 1185;
  private login_parent_id = 1185;


  getdata(page: number, startDate?: Date, endDate?: Date): Observable<any> {
    const today = new Date();

    const defaultStartDate = startDate ? startDate.toISOString().split('T')[0] : today.toISOString().split('T')[0];
    const defaultEndDate = endDate ? endDate.toISOString().split('T')[0] : today.toISOString().split('T')[0];

    const listdata: any = {
      "page": page,
      "orderby": "",
      "order": "",
      "search_by_entity_id": 0,
      "transaction_type": "",
      "payment_method_id": "",
      "start_date": defaultStartDate,
      "end_date": defaultEndDate,
      "export": 0,
      "chemist_id": this.chemist_id,
      "login_parent_id": this.login_parent_id,
      "accesstoken": this.accesstoken,
      "device_id": this.deviceId
    }
    const headers = { 'Content-Type': 'application/json' };
    return this.https.post('https://staging.evitalrx.in:3000/v3/expenses/list', listdata, { headers });
  }



  addData(data: any): Observable<any> {
    console.log('data', data.chequeDate);

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

    return this.https.post(this.expenseUrladd, formData);
  }


    deleteData(id: number): Observable<any> {

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
}





