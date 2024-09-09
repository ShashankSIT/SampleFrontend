import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { environment } from '@env/environment';

@Component({
  selector: 'app-image-cell-renderer',
  templateUrl: './image-cell-renderer.component.html',
  styleUrls: ['./image-cell-renderer.component.scss'],
})
export class ImageCellRendererComponent implements ICellRendererAngularComp {
  environment = environment;
  public displayValue!: any;
  shape!: string;
  size: any;
  agInit(params: any): void {
    this.displayValue = params.value;
    this.shape = params.shape ? params.shape : 'circle';
    this.size = params.size ? params.size : 'avatar-sm';
  }

  refresh(params: ICellRendererParams): boolean {
    return false;
  }

  showDefault(event: any) {
    event.target.src = '/assets/images/logo/main_logo_sm.png';
  }
}
