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

@Component({
  selector: 'app-manageexpence',
  templateUrl: './manageexpence.component.html',
  styleUrls: ['./manageexpence.component.scss']
})
export class ManageexpenceComponent implements OnInit, OnDestroy {
  @ViewChild('filterDialogTemplate') filterDialogTemplate!: TemplateRef<any>;
  @ViewChild('transactionFormTemplate') transactionFormTemplate!: TemplateRef<any>;

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
    'paymentMode',
    'amount',
    'gst',
    'remarks',
    'actions'
  ];
  dataSource = new MatTableDataSource<any>([]);

  selectedDateRange = 'last7days';
  selectedCategory: string | null = null;
  dateFilterOptions = [
    { label: 'Last 7 Days', value: 'last7days' },
    { label: 'Current Fiscal Year', value: 'currentFiscal' },
    { label: 'Previous Fiscal Year', value: 'previousFiscal' },
    { label: 'Custom Range', value: 'custom' }
  ];

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
    this.loadData();
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

    const dateRangeSubscription = this.dateRange.valueChanges.subscribe(range => {
      if (range.start && range.end) {
        this.filterDataByDateRange(new Date(range.start), new Date(range.end));
      }
    });

    if (gstSubscription) {
      this.subscriptions.push(gstSubscription);
    }
    if (dateRangeSubscription) {
      this.subscriptions.push(dateRangeSubscription);
    }
  }

  private loadData(): void {
    const dataSubscription = this.expenseService.getdata().subscribe({
      next: (response) => {
        this.data = response;
        this.updateDisplayData();
        this.applyDefaultFilters();
      },
      error: (error) => {
        this.showNotification('Error loading data', 'error');
      }
    });
    this.subscriptions.push(dataSubscription);
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
    let endDate = today;

    switch (filterType) {
      case 'last7days':
        startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
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

      const filteredData = this.data.data.results.filter((item: any) => {
        const itemDate = new Date(item.expense_date);
        return itemDate >= startDate && itemDate <= endDate;
      });

      this.dataSource.data = filteredData;
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
      filteredData = filteredData.filter(item => item.payment_mode === filters.paymentMode);
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
      const formData = new FormData();
      const formValue = this.transactionForm.value;

      Object.keys(formValue).forEach(key => {
        if (key !== 'document') {
          formData.append(key, formValue[key]);
        }
      });

      if (this.selectedFile) {
        formData.append('document', this.selectedFile);
      }

      console.log('Transaction data:', formValue);
      this.showNotification('Transaction saved', 'success');
      this.dialog.closeAll();
      this.loadData();
    }
  }

  editTransaction(transaction: any): void {
    this.selectedTransactionType = transaction.transaction_type;
    this.transactionForm.patchValue({
      category: transaction.category_id,
      amount: transaction.amount,
      hasGST: transaction.gst_percentage > 0,
      gstPercentage: transaction.gst_percentage,
      remarks: transaction.description,
      transactionDate: new Date(transaction.expense_date),
      paymentMode: transaction.payment_status
    });

    this.dialog.open(this.transactionFormTemplate, {
      width: '90%',
      maxWidth: '600px',
      position: { top: '60px' },
      maxHeight: '90vh'
    });
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
            this.loadData();
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

  downloadDocument(format: string): void {
    this.showNotification(`Downloading ${format.toUpperCase()}`, 'info');
  }


  private showNotification(message: string, type: 'success' | 'error' | 'info'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [`notification-${type}`]
    });
  }

  private applyDefaultFilters(): void {
    this.applyDateFilter('last7days');
  }
}
