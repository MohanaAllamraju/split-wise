import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewResultComponent } from './view-result/view-result.component';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ColDef, GridOptions } from 'ag-grid-community';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  columnDefs: ColDef[] = [
    { headerName: 'Name', field: 'name' },
    { headerName: 'Should Pay', field: 'shouldpay' },
    { headerName: 'Amount', field: 'amount' }
  ];
  myForm: FormGroup = this.fb.group({
    dropdown: ['', Validators.required],
    amountPaid: ['', Validators.required],
    paidFor: ['', Validators.required],
  });

  gridOptions: GridOptions = {
    columnDefs: this.columnDefs,
  };

  rowData: any[] = [];

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private bsModalRef: BsModalRef
  ) {

  }

  ngOnInit(): void { }

  calculate() {
    const name = this.myForm.get('dropdown')?.value;
    const paidBy = this.myForm.get('dropdown')?.value;
    const amountPaid = this.myForm.get('amountPaid')?.value;

    const paidFor = this.myForm.get('paidFor')?.value;

    const paidForCount = paidFor.split(',').length + 1;

    const recipients = paidFor.split(',');

    const amountPerRecipient = amountPaid / paidForCount;

    for (const recipient of recipients) {
      const existingRow = this.rowData.find((row) => row.name === recipient.trim())

      if (existingRow) {
        const existingPayer = this.rowData.find(row => row.shouldpay === paidBy.trim())
        if (existingPayer) {
          existingRow.amount = (parseFloat(existingRow.amount) + amountPerRecipient).toFixed(2);
        }
        else {
          this.rowData.push({ name: recipient.trim(), shouldpay: paidBy, amount: amountPerRecipient.toFixed(2) });
        }
      }
      else {
        this.rowData.push({ name: recipient.trim(), shouldpay: paidBy, amount: amountPerRecipient.toFixed(2) });
      }
    }

    this.gridOptions.api?.setRowData(this.rowData);

    const modalOptions: ModalOptions<ViewResultComponent> = {
      initialState: {
        result: amountPerRecipient
      }
    };

    // this.bsModalRef = this.modalService.show(ViewResultComponent, modalOptions);
  }
}