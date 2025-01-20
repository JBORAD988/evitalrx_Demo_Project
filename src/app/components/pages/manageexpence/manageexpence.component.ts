import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ExpenseService } from 'src/app/Services/expensesManagment/expense.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-manageexpence',
  templateUrl: './manageexpence.component.html',
  styleUrls: ['./manageexpence.component.scss']
})
export class ManageexpenceComponent implements OnInit {
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
    private datePipe: DatePipe
  ) {
    this.initializeForms();
  }

  ngOnInit(): void {
    this.loadData();
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

    this.transactionForm.get('hasGST')?.valueChanges.subscribe(hasGST => {
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
  }

  private loadData(): void {
    this.expenseService.getdata().subscribe({
      next: (response) => {
        this.data = response;
        this.updateDisplayData();
        this.applyDefaultFilters();
      },
      error: (error) => {
        this.showNotification('Error loading data', 'error');
      }
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

  onDateFilterChange(event: any): void {
    this.isCustomDateRange = event.value === 'custom';
    if (!this.isCustomDateRange) {
      this.applyDateFilter(event.value);
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
        startDate = new Date(today.getFullYear(), 3, 1);
        break;
      case 'previousFiscal':
        startDate = new Date(today.getFullYear() - 1, 3, 1);
        endDate = new Date(today.getFullYear(), 2, 31);
        break;
      default:
        return;
    }

    this.filterDataByDateRange(startDate, endDate);
  }

  filterDataByDateRange(start: Date, end: Date): void {
    if (this.data?.data?.results) {
      const filteredData = this.data.data.results.filter((item: any) => {
        const itemDate = new Date(item.expense_date);
        return itemDate >= start && itemDate <= end;
      });
      this.dataSource.data = filteredData;
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
    if (confirm('Delete this transaction?')) {
      console.log('Deleting:', transaction);
      this.showNotification('Transaction deleted', 'success');
      this.loadData();
    }
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
    console.log('Downloading:', format);
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

  calculateGrowth(value: number): number {
    return Math.round(Math.random() * 10);
  }
}
