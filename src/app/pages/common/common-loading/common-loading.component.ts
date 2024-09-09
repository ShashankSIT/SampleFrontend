import { Component, Input } from '@angular/core';
import { ILoadingOverlayAngularComp } from 'ag-grid-angular';
import { ILoadingOverlayParams } from 'ag-grid-community';

@Component({
  selector: 'app-common-loading',
  templateUrl: './common-loading.component.html',
  styleUrls: ['./common-loading.component.scss'],
})
export class CommonLoadingComponent implements ILoadingOverlayAngularComp {
  @Input() isLoading: boolean = false;
  @Input() appearance: '' | 'circle' | 'line' | 'custom-content' = '';
  @Input() count: number = 1;

  public params!: ILoadingOverlayParams;

  agInit(params: ILoadingOverlayParams & { gridCount: number }): void {
    this.count = params.gridCount + 3;
    this.isLoading = true;
    this.appearance = 'custom-content';
  }
}
