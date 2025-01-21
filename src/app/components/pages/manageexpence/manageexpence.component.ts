import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { ExpenseService } from 'src/app/Services/expensesManagment/expense.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface Category {
  key: number;
  value: string;
  type: 'ex' | 'in' | 'both';
}

interface PaymentMethod {
  key: number | null;
  value: string;
}
@Component({
  selector: 'app-manageexpence',
  templateUrl: './manageexpence.component.html',
  styleUrls: ['./manageexpence.component.scss']
})
export class ManageexpenceComponent implements OnInit, OnDestroy {
  @ViewChild('filterDialogTemplate') filterDialogTemplate!: TemplateRef<any>;
  @ViewChild('transactionFormTemplate') transactionFormTemplate!: TemplateRef<any>;


  categories: Category[] = [
    { key: 1, value: 'Bank fee and charges', type: 'ex' },
    { key: 2, value: 'Employee salaries & Advances', type: 'ex' },
    { key: 3, value: 'Printing and stationery', type: 'ex' },
    { key: 4, value: 'Raw material', type: 'ex' },
    { key: 5, value: 'Rent or mortgage payments', type: 'ex' },
    { key: 6, value: 'Repair & maintenances', type: 'ex' },
    { key: 7, value: 'Utilities & phone', type: 'ex' },
    { key: 8, value: 'Taxes / licenses / fees', type: 'ex' },
    { key: 9, value: 'Food & Beverage', type: 'ex' },
    { key: 15, value: 'Missing cash(cash loss)', type: 'ex' },
    { key: 10, value: 'Other', type: 'both' },
    { key: 16, value: 'Extra cash', type: 'in' },
    { key: 18, value: 'Advertisement', type: 'in' },
    { key: 19, value: 'Scrap material', type: 'in' },
    { key: 20, value: 'Any rental income', type: 'in' },
    { key: 21, value: 'Interest income', type: 'in' }
  ];

  paymentMethods: PaymentMethod[] = [
    { key: 1, value: 'Cash' },
    { key: 3, value: 'UPI' },
    { key: null, value: 'Cheque' },
    { key: 5, value: 'Paytm' },
    { key: 6, value: 'CC/DC' },
    { key: null, value: 'RTGS/NEFT' }
  ];

  data: any;
  selectedTransactionType: 'income' | 'expense' = 'income';
  isCustomDateRange = false;
  showGSTFields = false;
  selectedFile: File | null = null;
  transactionForm!: FormGroup;
  filterForm!: FormGroup;
  dateRange!: FormGroup;
  private subscriptions: Subscription[] = [];

  displayedColumns: string[] = [
    'entryDate',
    'category',
    'transactionType',
    'expenseBy',
    'paymentMode',
    'refNo',
    'amount',
    'gst',
    'total',
    'remarks',
    'actions'
  ];
  dataSource = new MatTableDataSource<any>([]);

  selectedDateRange = 'today';
  selectedCategory: number | null = null;
  dateFilterOptions = [
    { label: 'Today', value: 'today' },
    { label: 'Last 7 Days', value: 'last7days' },
    { label: 'Current Fiscal Year', value: 'currentFiscal' },
    { label: 'Previous Fiscal Year', value: 'previousFiscal' },
    { label: 'Custom Range', value: 'custom' }
  ];

  get filteredCategories(): Category[] {
    return this.categories.filter(category =>
      category.type === 'both' ||
      (this.selectedTransactionType === 'income' && category.type === 'in') ||
      (this.selectedTransactionType === 'expense' && category.type === 'ex')
    );
  }

  constructor(
    private expenseService: ExpenseService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private toast: ToastrService,
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadData(1);
    this.setupSubscriptions();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private initializeForms(): void {
    this.transactionForm = this.fb.group({
      category: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0)]],
      hasGST: [false],
      gstPercentage: [''],
      gstnNumber: [''],
      partyName: [''],
      hsnCode: [''],
      paymentMode: ['', Validators.required],
      referenceNo: [''],
      remarks: [''],
      transactionDate: [new Date(), Validators.required],
      paymentDate: [''],
      document: ['']
    });

    this.filterForm = this.fb.group({
      staff: [''],
      transactionType: [''],
      paymentMode: ['']
    });

    this.dateRange = this.fb.group({
      start: [''],
      end: ['']
    });
  }

  getCategoryValue(key: number): string {
    const category = this.categories.find(cat => cat.key === key);
    return category ? category.value : '';
  }

  getPaymentMethodValue(key: number | null): string {
    const method = this.paymentMethods.find(method => method.key === key);
    return method ? method.value : '';
  }

  getFilteredCategories(): Category[] {
    return this.categories.filter(category =>
      category.type === 'both' ||
      (this.selectedTransactionType === 'income' && category.type === 'in') ||
      (this.selectedTransactionType === 'expense' && category.type === 'ex')
    );
  }


  applyCategoryFilter(): void {
    if (!this.data?.data?.results) return;

    const filteredData = this.selectedCategory !== null
      ? this.data.data.results.filter((item: any) => item.category_id === this.selectedCategory)
      : this.data.data.results; // If "All" is selected, show all data

    this.dataSource.data = filteredData;

    const categoryName = this.selectedCategory !== null
      ? this.categories.find(c => c.key === this.selectedCategory)?.value
      : 'All';

    this.showNotification(`Showing data for category: ${categoryName}`, 'info');
  }

  private setupSubscriptions(): void {
    const gstSubscription = this.transactionForm.get('hasGST')?.valueChanges.subscribe(hasGST => {
      this.showGSTFields = hasGST;
      const gstControls = ['gstPercentage', 'gstnNumber', 'partyName', 'hsnCode'];
      if (hasGST) {
        gstControls.forEach(control => {
          this.transactionForm.get(control)?.setValidators([Validators.required]);
        });
      } else {
        gstControls.forEach(control => {
          this.transactionForm.get(control)?.clearValidators();
          this.transactionForm.get(control)?.updateValueAndValidity();
        });
      }
    });

    if (gstSubscription) {
      this.subscriptions.push(gstSubscription);
    }

    const dateRangeSubscription = this.dateRange.valueChanges.subscribe(range => {
      if (range.start && range.end) {
        this.filterDataByDateRange(new Date(range.start), new Date(range.end));
      }
    });

    if (dateRangeSubscription) {
      this.subscriptions.push(dateRangeSubscription);
    }
  }

  private loadData(page:number): void {
    const dataSubscription = this.expenseService.getdata(page).subscribe({
      next: (response) => {
        this.data = response;
        this.updateDisplayData();
      },
      error: (error) => {
        this.showNotification('Error loading data', 'error');
      }
    });
    this.subscriptions.push(dataSubscription);
  }


  private loadCustomeData(page: number, startDate?: Date, endDate?: Date): void {
    const dataSubscription = this.expenseService.getdata(page, startDate, endDate).subscribe({
      next: (response) => {
        this.data = response;
        this.updateDisplayData();
        this.applyDefaultFilters();
      },
      error: () => {
        this.showNotification('Error loading data', 'error');
      }
    });
    this.subscriptions.push(dataSubscription);
  }



  addIncome(): void {
    this.selectedTransactionType = 'income';
    this.resetTransactionForm();
    this.dialog.open(this.transactionFormTemplate, {
      width: '90%',
      maxWidth: '600px',
      position: { top: '60px' },
      maxHeight: '90vh'
    });
  }

  addExpense(): void {
    this.selectedTransactionType = 'expense';
    this.resetTransactionForm();
    this.dialog.open(this.transactionFormTemplate, {
      width: '90%',
      maxWidth: '600px',
      position: { top: '60px' },
      maxHeight: '90vh'
    });
  }



  private updateDisplayData(): void {
    if (this.data?.data?.results) {
      this.dataSource.data = this.data.data.results.map((item: any) => ({
        ...item,
        formattedDate: this.datePipe.transform(item.expense_date, 'medium')
      }));
    }
  }

  onDateFilterChange(event: any): void {
    this.isCustomDateRange = event.value === 'custom';
    if (!this.isCustomDateRange) {
      this.applyDateFilter(event.value);
    } else {
      this.dateRange.reset();
    }
  }

  applyDateFilter(filterType: string): void {
    const today = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (filterType) {
      case 'today':
        startDate = new Date(today.setHours(0, 0, 0, 0));
        endDate = new Date(today.setHours(23, 59, 59, 999));
        break;
      case 'last7days':
        startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        endDate = today;
        break;
      case 'currentFiscal':
        const currentYear = today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1;
        startDate = new Date(currentYear, 3, 1);
        endDate = new Date(currentYear + 1, 2, 31);
        break;
      case 'previousFiscal':
        const prevYear = today.getMonth() >= 3 ? today.getFullYear() - 1 : today.getFullYear() - 2;
        startDate = new Date(prevYear, 3, 1);
        endDate = new Date(prevYear + 1, 2, 31);
        break;
      default:
        return;
    }

    this.filterDataByDateRange(startDate, endDate);
  }


  filterDataByDateRange(start: Date, end: Date): void {
    if (this.data?.data?.results) {
      const startDate = new Date(start.setHours(0, 0, 0, 0));
      const endDate = new Date(end.setHours(23, 59, 59, 999));

      this.loadCustomeData(1, startDate, endDate);

      this.showNotification(`Showing data from ${this.datePipe.transform(startDate, 'mediumDate')} to ${this.datePipe.transform(endDate, 'mediumDate')}`, 'info');
    }
  }

  openFilterDialog(): void {
    this.dialog.open(this.filterDialogTemplate, {
      width: '90%',
      maxWidth: '500px',
      position: { top: '60px' },
      maxHeight: '90vh'
    });
  }



  resetTransactionForm(): void {
    this.transactionForm.reset({
      hasGST: false,
      transactionDate: new Date()
    });
    this.selectedFile = null;
  }

  onGSTToggle(event: any): void {
    this.showGSTFields = event.checked;
    this.transactionForm.patchValue({ hasGST: event.checked });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.transactionForm.patchValue({ document: file.name });
    }
  }


  currentPage: number = 1;

loadPage(page: number): void {
  if (page < 1) return;

  this.currentPage = page;
  this.loadData(page);
}





  applyFilters(): void {
    const filters = this.filterForm.value;
    let filteredData = [...this.data.data.results];

    if (filters.staff) {
      filteredData = filteredData.filter(item => item.expense_by_name === filters.staff);
    }
    if (filters.transactionType) {
      filteredData = filteredData.filter(item => item.transaction_type === filters.transactionType);
    }
    if (filters.paymentMode) {
      filteredData = filteredData.filter(item => item.payment_status === filters.paymentMode);
    }

    this.dataSource.data = filteredData;
    this.dialog.closeAll();
    this.showNotification('Filters applied successfully', 'success');
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.updateDisplayData();
    this.showNotification('Filters reset', 'success');
  }

  submitTransaction(): void {
    if (this.transactionForm.valid) {
      const formValue = this.transactionForm.value;

      const transactionData = {
        transaction_type: this.selectedTransactionType,
        category: formValue.category,
        paymentMode: formValue.paymentMode,
        ...formValue
      };

      if (this.selectedFile) {
        transactionData['document'] = this.selectedFile;
      }

      console.log('Transaction Data:', transactionData);

      this.expenseService.addData(transactionData).subscribe({
        next: (res) => {
          if(res.status_code === "1") {
            this.toast.success(res.status_message, 'Success');
        } else {
            this.toast.error(res.status_message, 'Error');
        }
          this.dialog.closeAll();
          this.loadData(1);
        },
        error: (error) => {
          this.toast.error(`Error saving transaction`, 'Error');
        }
      });
    }
  }



  deleteTransaction(transaction: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This transaction will be deleted permanently',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.toast.info('Deleting transaction...', 'Info');

        this.expenseService.deleteData(transaction.id).subscribe({
          next: () => {
            this.toast.success('Transaction deleted successfully!', 'Success');
            this.loadData(1);
          },
          error: () => {
            this.toast.error('Error deleting transaction', 'Error');
          }
        });
      }
    });
  }

  downloadInvoice(transaction: any): void {
    if (transaction.invoice_photo) {
      const link = document.createElement('a');
      link.href = transaction.invoice_photo;
      link.target = '_blank';
      link.download = `invoice-${transaction.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }


  //download table functions  ---- start
  downloadDocument(format: string): void {
    this.showNotification(`Downloading ${format.toUpperCase()}`, 'info');
    switch (format) {
      case 'pdf':
        this.downloadPDF();
        break;
      case 'excel':
        this.downloadExcel();
        break;
      case 'csv':
        this.downloadCSV();
        break;
      default:
        this.showNotification('Invalid format selected', 'error');
    }

  }


   // Function to download PDF
   downloadPDF(): void {
    const doc = new jsPDF();
    const tableData = this.dataSource.data.map(item => [
      item.expense_date,
      this.getCategoryValue(item.category_id),
      item.transaction_type,
      item.expense_by_name,
      this.getPaymentMethodValue(item.payment_status),
      item.reference_no,
      item.amount,
      item.gst_percentage,
      item.total,
      item.description
    ]);

    // Add table to PDF
    autoTable(doc, {
      head: [['Entry Date', 'Category', 'Transaction Type', 'Entry By', 'Payment Mode', 'Ref. No', 'Amount', 'GST (%)', 'Total', 'Remarks']],
      body: tableData
    });

    // Save PDF
    doc.save('transactions.pdf');
  }

  // Function to download Excel
  downloadExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
    XLSX.writeFile(wb, 'transactions.xlsx');
  }

  // Function to download CSV
  downloadCSV(): void {
    const header = ['Entry Date', 'Category', 'Transaction Type', 'Entry By', 'Payment Mode', 'Ref. No', 'Amount', 'GST (%)', 'Total', 'Remarks'];
    const rows = this.dataSource.data.map((item: any) => [
      item.expense_date,
      this.getCategoryValue(item.category_id),
      item.transaction_type,
      item.expense_by_name,
      this.getPaymentMethodValue(item.payment_status),
      item.reference_no,
      item.amount,
      item.gst_percentage,
      item.total,
      item.description
    ]);

    let csvContent = 'data:text/csv;charset=utf-8,' + header.join(',') + '\n';

    rows.forEach((row:any) => {
      csvContent += row.join(',') + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'transactions.csv');
    link.click();
  }


//download table functions  ---- end


  private showNotification(message: string, type: 'success' | 'error' | 'info'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [`notification-${type}`]
    });
  }

  private applyDefaultFilters(): void {
    // this.applyDateFilter('today');
  }
}
