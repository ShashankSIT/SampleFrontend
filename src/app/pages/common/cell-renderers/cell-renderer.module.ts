import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionCellRendererComponent } from './action-cell-renderer/action-cell-renderer.component';
import { RouterModule } from '@angular/router';
// Import any additional Angular modules here, such as FormsModule, ReactiveFormsModule, etc.

@NgModule({
  declarations: [
    // Declare components, directives, pipes that are part of this module here
    ActionCellRendererComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    // Import other Angular modules or custom modules here
  ],
  exports: [
    // Export components, directives, or pipes that need to be used in other modules
    ActionCellRendererComponent,
  ],
})
export class CellRendererModule {}
