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
