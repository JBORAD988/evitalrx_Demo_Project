import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  constructor(private https: HttpClient) { }

  private expenseUrladd = "https://staging.evitalrx.in:3000/v3/expenses/add";

  private accesstoken = 'bjuz67a813oyx8rr';
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
      const formData = new FormData();
      formData.append('accesstoken', this.accesstoken);
      formData.append('category_id', data.category_id);
      formData.append('expense_date', data.expense_date);
      formData.append('payment_method_id', data.payment_method_id);
      formData.append('amount', data.amount);
      formData.append('remark', data.remark);
      formData.append('account_id', data.account_id);
      formData.append('cheque_date', data.cheque_date);
      formData.append('reference_no', data.reference_no);
      formData.append('payment_date', data.payment_date);
      formData.append('transaction_type', data.transaction_type);
      formData.append('party_name', data.party_name);
      formData.append('chemist_id', data.chemist_id);
      formData.append('device_id', this.deviceId);
      formData.append('login_parent_id', data.chemist_id);

      return this.https.post(this.expenseUrladd, formData);
    }

    deleteData(id: number): Observable<any> {
      debugger;
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





