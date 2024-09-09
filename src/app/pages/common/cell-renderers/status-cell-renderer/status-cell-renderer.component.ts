import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-status-cell-renderer',
  templateUrl: './status-cell-renderer.component.html',
  styleUrls: ['./status-cell-renderer.component.scss'],
})
export class StatusCellRendererComponent implements ICellRendererAngularComp {
  public displayValue!: any;
  agInit(params: ICellRendererParams): void {
    this.displayValue = params.value;
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  get _value() {
    if (typeof this.displayValue === 'boolean')
      return this.displayValue
        ? 'USERS.USERGRID.APPROVEADSVALUE.YES.TEXT'
        : 'USERS.USERGRID.APPROVEADSVALUE.NO.TEXT';
    return this.displayValue;
  }
}
