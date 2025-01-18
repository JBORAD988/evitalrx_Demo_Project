import { Component } from '@angular/core';
import { ExpenseService } from 'src/app/Services/expensesManagment/expense.service';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-manageexpence',
  templateUrl: './manageexpence.component.html',
  styleUrls: ['./manageexpence.component.scss']
})
export class ManageexpenceComponent {

  data:any;

  constructor(private Expense: ExpenseService ) {
 this.Expense.getdata().subscribe((data) => {
  this.data = data;
  console.log(data);
 });

  }




  selectedDateRange = 'last7days';
  selectedCategory: string | null = null;
  totalIncome = 50000;
  totalExpense = 20000;

  dateFilterOptions = [
    { label: 'Last 7 Days', value: 'last7days' },
    { label: 'Current Fiscal Year', value: 'currentFiscal' },
    { label: 'Previous Fiscal Year', value: 'previousFiscal' },
    { label: 'Custom Range', value: 'custom' }
  ];

  categories = ['Food', 'Transport', 'Salary', 'Utilities'];

  displayedColumns: string[] = ['entryDate', 'category', 'transactionType', 'paymentMode', 'amount', 'gst', 'remarks', 'actions'];

  dataSource = new MatTableDataSource([
    { entryDate: new Date(), category: 'Food', transactionType: 'Debit', paymentMode: 'Cash', amount: 500, gst: 18, remarks: 'Lunch' }
  ]);


  onDateFilterChange(event: any) {
    console.log("Date filter changed to:", event.value);
  }

  onCategoryChange(event: any) {
    console.log("Category changed to:", event.value);
  }

  showRemark(remark: string) { alert("Remark: " + remark); }
  deleteRow(element: any) { console.log("Deleting", element); }
  downloadRow(element: any) { console.log("Downloading", element); }
  toggleFilterSidebar() { console.log("Toggling Sidebar"); }

  addIncome() {
    console.log("Adding Income/Deposit...");
  }

  addExpense() {
    console.log("Adding Expense/Withdraw...");
  }

  downloadPDF() {
    console.log("Downloading PDF...");
  }
}


