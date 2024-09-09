import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommonLoadingComponent } from './common-loading/common-loading.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
// Import any additional Angular modules here, such as FormsModule, ReactiveFormsModule, etc.

@NgModule({
  declarations: [CommonLoadingComponent],
  imports: [CommonModule, RouterModule, NgxSkeletonLoaderModule],
  exports: [CommonLoadingComponent],
})
export class CommonComponentModule {}
