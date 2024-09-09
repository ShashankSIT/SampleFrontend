import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-action-cell-renderer',
  templateUrl: './action-cell-renderer.component.html',
  styleUrls: ['./action-cell-renderer.component.scss'],
})
export class ActionCellRendererComponent
  implements ICellRendererAngularComp, OnChanges
{
  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }

  constructor(
    private commonService: CommonService,
    private router: Router,
  ) {}

  public displayValue!: any;
  id: string;
  showDeleteButton = true;
  editWithModal = false;
  showEditButton = true;
  public fieldName!: any;
  agInit(params: ICellRendererParams): void {
    this.displayValue = params;
    if (this.displayValue.showDeleteButton != null) {
      this.showDeleteButton = this.displayValue.showDeleteButton;
    }
    if (this.displayValue.showEditButton != null) {
      this.showEditButton = this.displayValue.showEditButton;
    }
    if (this.displayValue.editWithModal != null) {
      this.editWithModal = this.displayValue.editWithModal;
    }
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  onEdit(data: any): void {
    debugger;
    const encryptedId = data
      ? this.commonService.Encrypt(data.Id.toString())
      : '';
    this.router.navigate([
      `${this.displayValue.data.editRoutePath}${encodeURIComponent(encryptedId)}`,
    ]);
  }

  onActionClick(actionType: string, _id: string, data: any) {
    const id = _id ? this.commonService.Encrypt(_id.toString()) : '';

    this.fieldName = data ? data.data.categoryName : '';
    this.displayValue.clicked(
      actionType,
      id,
      this.fieldName,
      this.displayValue.data.avatarPath,
    );
  }
}
