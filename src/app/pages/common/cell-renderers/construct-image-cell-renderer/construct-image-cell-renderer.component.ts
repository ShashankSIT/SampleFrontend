import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { environment } from '@env/environment';

@Component({
  selector: 'app-construct-image-cell-renderer',
  templateUrl: './construct-image-cell-renderer.component.html',
  styleUrls: ['./construct-image-cell-renderer.component.scss'],
})
export class ConstructImageCellRendererComponent
  implements ICellRendererAngularComp
{
  environment = environment;
  public displayValue!: any;
  shape!: string;
  size!: string;

  agInit(params: any): void {
    this.displayValue = params.data;
    this.displayValue.backgroundImg =
      this.displayValue.backgroundImg.replaceAll(' ', '%20');
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
