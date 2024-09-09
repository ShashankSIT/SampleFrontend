import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-multivalue-cell-renderer',
  templateUrl: './multivalue-cell-renderer.component.html',
  styleUrls: ['./multivalue-cell-renderer.component.scss'],
})
export class MultivalueCellRendererComponent
  implements ICellRendererAngularComp
{
  public params: any;

  agInit(params: any): void {
    this.params = params.value;
  }

  refresh(): boolean {
    return false;
  }
}
