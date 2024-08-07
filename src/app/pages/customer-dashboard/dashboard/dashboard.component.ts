import { Component, OnInit } from '@angular/core';
import { ApiUrlHelper } from 'src/app/config/apiUrlHelper';
import { RoleName } from 'src/app/core/enums/common-enum';
import { PaginationModel } from 'src/app/core/model/common-model';
import { CommonService } from 'src/app/core/services/common.service';
import {
  StorageKey,
  StorageService,
} from 'src/app/core/services/storage.service';
import { ChartOptions } from 'src/app/demo/chart/apex-chart/apex-chart.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  barSimpleChart: Partial<ChartOptions>;
  lineAreaChart: Partial<ChartOptions>;
  donutChartForGarment: Partial<ChartOptions>;
  semiDonut: Partial<ChartOptions>;
  donutChartEndOfLife: Partial<ChartOptions>;
  isCustomerAdmin: boolean = false;
  progress: number = 69;
  dashboardData: any = {
    deliveredParcels: 0,
    deliveredParcelsPercentage: 0,
    SavedCO2: 0,
    GarmentPurchased: 0,
    LifeRecycledKG: 0,
    CarbonEmission: 0,
  };
  branchList: any[] = [];
  branchId: number = 0;
  totalFilteredRecords: number = 0;
  filterParams: PaginationModel = {
    PageSize: 10,
    PageNumber: 1,
    SortColumn: '',
    SortOrder: '',
    StrSearch: '',
  };
  constructor(
    private apiUrl: ApiUrlHelper,
    private commonService: CommonService,
    private storageService: StorageService,
  ) {}

  ngOnInit() {
    this.getGRSMaterialPurchasesDetails();
    this.getCarbonReductionChartMasterDetails();
    this.getDashboardDetails();
    var userData = this.storageService.getValue(StorageKey.loginData);
    if (userData.RoleName == RoleName.CustomerAdmin) {
      this.isCustomerAdmin = true;
      this.branchId = this.storageService.getValue(StorageKey.branchId);
      if(this.branchId > 10){
        this.filterParams.PageSize = this.branchId + 1;
      }
      this.getBranchList(this.filterParams);
    }
  }

  getBranchList(params: any) {
    const obj = {   
      ...params,
    };
    const apiUrl = this.apiUrl.apiUrl.user.getBranchDropdownList;
    this.commonService
      .doPost(apiUrl, obj)
      .pipe()
      .subscribe({
        next: (data) => {
          if (data && data.Success&& Array.isArray(data.Data) && data.Data.length > 0) {
            this.branchList = [...this.branchList, ...data.Data];
            this.totalFilteredRecords = data.Data[0].TotalFilteredRecord;
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  onClearBranch() {
    this.filterParams.PageNumber = 1;
    this.filterParams.PageSize = 10;
    this.filterParams.StrSearch = '';
    this.branchList = [];
    this.getBranchList(this.filterParams);
  }
  onSearchBranch(event: any) {
    this.filterParams.StrSearch = event.term;
    this.filterParams.PageNumber = 1;
    this.branchList = [];
    this.getBranchList(this.filterParams);
  }
  onChangeBranch(event: any) {
    this.branchId = event.BranchId;
    this.getGRSMaterialPurchasesDetails();
    this.getCarbonReductionChartMasterDetails();
    this.getDashboardDetails();
  }
  onScrollToEnd() {
    if (this.branchList.length < this.totalFilteredRecords) {
      this.filterParams.PageNumber++;
      this.getBranchList(this.filterParams);
    }
  }

  getDashboardDetails() {
    const apiUrl = this.apiUrl.apiUrl.dashboard.getDashboardMasterDetail;
    const obj = {
      UserId: 0,
      BranchId: this.branchId,
    };
    this.commonService.doPost(apiUrl, obj).subscribe({
      next: (data) => {
        if (data.Data) {
          this.dashboardData = { ...data.Data };
          this.initializeChart();
        } else {
          this.dashboardData = [];
          this.initializeChart();
        }
      },
      error: (er) => {
        console.error(er);
      },
      complete: () => {
        console.info('complete');
      },
    });
  }

  getGRSMaterialPurchasesDetails() {
    const apiUrl = this.apiUrl.apiUrl.dashboard.getGRSMaterialPurchasesDetail;
    const obj = {
      UserId: 0,
      BranchId: this.branchId,
    };
    this.commonService.doPost(apiUrl, obj).subscribe({
      next: (data) => {
        if (data.Data) {
          this.lineAreaChart = {
            series: [
              {
                name: 'GRS Materials',
                data: data.Data.map((item) => item.Value),
                color: '#BBF249',
              },
            ],
            chart: {
              height: 250,
              // width: '130%',
              toolbar: {
                show: false,
              },
              type: 'line',
              zoom: {
                enabled: false,
              },
            },
            dataLabels: {
              enabled: false,
            },
            stroke: {
              curve: 'smooth',
            },
            grid: {
              show: false,
              row: {
                colors: ['transparent'], // takes an array which will be repeated on columns
                opacity: 0.5,
              },
            },
            xaxis: {
              categories: data.Data.map((item) => item.MaterialNumber),
            },
            yaxis: {
              labels: {
                show: false,
              },
            },
          };
        }
      },
      error: (er) => {
        console.error(er);
      },
      complete: () => {
        console.info('complete');
      },
    });
  }

  getCarbonReductionChartMasterDetails() {
    const apiUrl =
      this.apiUrl.apiUrl.dashboard.getCarbonReductionChartMasterDetail;
    const obj = {
      UserId: 0,
      BranchId: this.branchId,
    };
    this.commonService.doPost(apiUrl, obj).subscribe({
      next: (data) => {
        if (data.Data) {
          this.barSimpleChart = {
            series: [
              {
                name: 'Carbon Reduction',
                data: data.Data.map((item) => item.Value),
              },
            ],
            chart: {
              type: 'bar',
              height: 350,
              toolbar: {
                show: false, // Hide the toolbar which includes the download button
              },
            },
            plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: '45%',
                borderRadius: 10,
                borderRadiusApplication: 'end',
              },
            },
            dataLabels: {
              enabled: false,
            },
            stroke: {
              show: true,
              width: 2,
              colors: ['transparent'],
            },
            xaxis: {
              categories: data.Data.map((item) => item.Month),
            },
            yaxis: {
              labels: {
                show: false,
              },
            },
            grid: {
              show: false, // Hide all grid lines (both horizontal and vertical)
            },
            fill: {
              opacity: 1,
              colors: [this.getBarColors()],
            },
            tooltip: {
              y: {
                formatter: function (val) {
                  return val.toString();
                },
              },
            },
          };
        }
      },
      error: (er) => {
        console.error(er);
      },
      complete: () => {
        console.info('complete');
      },
    });
  }

  initializeChart() {
    this.donutChartForGarment = {
      chart: {
        type: 'donut',
        width: '100%',
        height: 230,
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          customScale: 1.0,
          donut: {
            size: '80%',
            labels: {
              show: true,
              name: {
                show: false,
              },
              value: {
                show: true,
                fontSize: '40px',
                color: '#C7F001',
                fontFamily: '',
                fontWeight: '900',
                offsetY: 10,
                formatter: (opts: any) => {
                  return `${this.dashboardData?.GarmentPurchased ?? 0}%`;
                },
              },
              total: {
                show: true,
                showAlways: false,
                label: 'Progress',
                fontSize: '16px',
                fontWeight: 600,
                color: '#373d3f',
                formatter: (w) => {
                  return `${this.dashboardData?.GarmentPurchased ?? 0}%`;
                },
              },
            },
          },
          offsetY: 20,
          startAngle: -25,
          endAngle: 335,
        },
      },
      stroke: {
        width: 0,
      },
      colors: ['#C7F001', '#454545'],
      series: [
        this.dashboardData?.GarmentPurchased ?? 0,
        100 - this.dashboardData?.GarmentPurchased ?? 0,
      ],
      labels: ['Completed', ''],
      legend: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    };

    this.donutChartEndOfLife = {
      chart: {
        type: 'donut',
        width: '100%',
        height: 250,
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          customScale: 1.0,
          donut: {
            size: '80%',
            labels: {
              show: true,
              name: {
                show: false,
              },
              value: {
                show: true,
                fontSize: '40px',
                color: '#C7F001',
                fontFamily: '',
                fontWeight: '900',
                offsetY: 10,
                formatter: (opts: any) => {
                  return `${this.dashboardData?.LifeRecycledKG ?? 0}KG`;
                },
              },
              total: {
                show: true,
                showAlways: false,
                label: 'Progress',
                fontSize: '16px',
                fontWeight: 600,
                color: '#373d3f',
                formatter: (w) => {
                  return `${this.dashboardData?.LifeRecycledKG ?? 0}KG`;
                },
              },
            },
          },
          offsetY: 20,
          startAngle: -25,
          endAngle: 335,
        },
      },
      stroke: {
        width: 0,
      },
      colors: ['#C7F001', '#454545'],
      series: [
        this.dashboardData?.LifeRecycledKG ?? 0,
        100 - this.dashboardData?.LifeRecycledKG ?? 0,
      ],
      labels: ['Completed', ''],
      legend: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    };

    this.semiDonut = {
      chart: {
        type: 'donut',
        width: '100%',
        height: 250,
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          customScale: 1.0,
          donut: {
            size: '85%',
            labels: {
              show: true,
              value: {
                show: true,
                fontSize: '40px',
                color: '#C7F001',
                fontFamily: '',
                fontWeight: '900',
                offsetY: -10,
                formatter: (opts: any) => {
                  return `${this.dashboardData?.CarbonEmission ?? 0}%`;
                },
              },
              total: {
                show: true,
                showAlways: false,
                label: '',
                fontSize: '16px',
                fontWeight: 600,
                color: '#373d3f',
                formatter: (w) => {
                  return `${this.dashboardData?.CarbonEmission ?? 0}%`;
                },
              },
            },
          },
          offsetY: 0,
          startAngle: -135,
          endAngle: 135,
        },
      },

      stroke: {
        width: 0,
      },
      colors: ['#C7F001', '#F7F7F7'],
      series: [
        this.dashboardData?.CarbonEmission ?? 0,
        100 - this.dashboardData?.CarbonEmission ?? 0,
      ],
      labels: ['', ''],
      legend: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    };
  }

  getBarColors() {
    return ({ dataPointIndex }) => {
      return dataPointIndex % 2 === 0 ? '#BBF249' : '#E5FFAF';
    };
  }
}
