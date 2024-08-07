import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerDashboardRoutingModule } from './customer-dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import ApexChartComponent from 'src/app/demo/chart/apex-chart/apex-chart.component';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    CustomerDashboardRoutingModule,
    ApexChartComponent,
    CardComponent,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CustomerDashboardModule { }
