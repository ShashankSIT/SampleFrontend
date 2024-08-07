import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { ApiUrlHelper } from 'src/app/config/apiUrlHelper';
import { NotificationType } from 'src/app/core/enums/common-enum';
import { PaginationModel } from 'src/app/core/model/common-model';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  dashboardForm: FormGroup = this.formBuilder.group({});
  dashboardId: number = 0;
  companyId: number = 0;
  staticMonths: any[] = [];
  branchList: any[] = [];
  timeoutId: any;
  companyList: any[] = [];
  totalFilteredRecords: number = 0;
  showCarbonReduction: boolean = false;
  showGRPUsed: boolean = false;
  typeahead = new Subject<string>();
  filterParams: PaginationModel = {
    PageSize: 10,
    PageNumber: 1,
    SortColumn: 'LocationName',
    SortOrder: 'ASC',
    StrSearch: '',
  };
  formDisabled: boolean = true;
  formFields = [
    {
      name: 'CarbonEmission',
      label: 'Carbon Emission',
      placeholder: 'Enter Carbon Emission',
      required: true,
      class: 'col-md-3',
    },
    {
      name: 'GarmentPurchased',
      label: 'Garment Purchased',
      placeholder: 'Enter Garment Purchased',
      required: true,
      class: 'col-md-3',
    },
    {
      name: 'LifeRecycledKG',
      label: 'Life Recycled (KG)',
      placeholder: 'Enter Life Recycled (KG)',
      required: true,
      class: 'col-md-3',
    },
    {
      name: 'ParcelDelivered',
      label: 'Parcel Delivered',
      placeholder: 'Enter Parcel Delivered',
      required: true,
      class: 'col-md-3',
    },
    {
      name: 'EvPercentage',
      label: 'EV Percentage',
      placeholder: 'Enter EV Percentage',
      required: true,
      class: 'col-md-3',
    },
    {
      name: 'SavedCO2',
      label: 'Saved CO2',
      placeholder: 'Enter Saved CO2',
      required: true,
      class: 'col-md-3',
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private apiUrl: ApiUrlHelper,
    private commonService: CommonService,
  ) {}

  ngOnInit(): void {
    this.initDashboardForm();
    this.getCompanyList();
  }

  onChange(event: any) {
    this.formDisabled = false;
    this.enableFormControls();
    this.getDashboardDetails(event?.BranchId);
    this.getCarbonReductionChartMasterDetails(event?.BranchId);
    this.getGRSMaterialPurchasesDetails(event?.BranchId);
  }

  onChangeCompany(event: any) {
    this.companyId = event?.CompanyId;
    if (this.companyId > 0) {
      this.dashboardForm.get('BranchId').setValue(null);
      this.branchList = [];
      this.getBranchList(this.filterParams);
      this.resetDashboardForm([]);
    }
  }

  enableFormControls() {
    const controls = Object.keys(this.dashboardForm.controls);
    controls.forEach((controlName) => {
      this.dashboardForm.controls[controlName].enable();
    });
  }

  disableFormControls() {
    this.formDisabled = true;
    const controls = Object.keys(this.dashboardForm.controls);
    controls.forEach((controlName) => {
      if (controlName !== 'BranchId') {
        const control = this.dashboardForm.controls[controlName];
        control.disable();
        control.reset();
      }
    });
  }

  getBranchList(params: any) {
    const obj = {
      ...params,
      Id: this.companyId,
    };
    const apiUrl = this.apiUrl.apiUrl.user.getBranchDropdownList;
    this.commonService
      .doPost(apiUrl, obj)
      .pipe()
      .subscribe({
        next: (data) => {
          if (
            data &&
            data.Success &&
            Array.isArray(data.Data) &&
            data.Data?.length > 0
          ) {
            if (params.StrSearch) {
              this.branchList = [];
            }
            this.branchList = [...this.branchList, ...data.Data];
            this.totalFilteredRecords = data.Data[0].TotalFilteredRecord;
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  getCompanyList() {
    const obj = {
      PageSize: 10000,
      PageNumber: 1,
      SortColumn: '',
      SortOrder: '',
      StrSearch: '',
    };
    const apiUrl = this.apiUrl.apiUrl.user.getCompanyDropdownList;
    this.commonService
      .doPost(apiUrl, obj)
      .pipe()
      .subscribe({
        next: (data) => {
          if (data && data.Success) {
            this.companyList = [...this.companyList, ...data.Data];
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  onClear() {
    this.disableFormControls();
    this.filterParams.PageNumber = 1;
    this.filterParams.PageSize = 10;
    this.filterParams.StrSearch = '';
    this.branchList = [];
    this.getBranchList(this.filterParams);
  }
  onScrollToEnd() {
    if (this.branchList.length < this.totalFilteredRecords) {
      this.filterParams.PageNumber++;
      this.getBranchList(this.filterParams);
    }
  }
  onSearch(event: any) {
    this.filterParams.StrSearch = event.term;
    this.filterParams.PageNumber = 1;
    this.branchList = [];
    clearTimeout(this.timeoutId);
    this.timeoutId = setTimeout(() => {
      this.getBranchList(this.filterParams);
    }, 500);
  }

  initDashboardForm() {
    this.dashboardForm = this.formBuilder.group({
      BranchId: [null, [Validators.required]],
      CarbonEmission: [null, [Validators.required]],
      GarmentPurchased: [null, [Validators.required]],
      LifeRecycledKG: [
        null,
        [Validators.required, Validators.pattern('^[0-9]+$')],
      ],
      ParcelDelivered: [null, [Validators.required]],
      EvPercentage: [null, [Validators.required]],
      SavedCO2: [null, [Validators.required, Validators.pattern('^[0-9]+$')]],
      carbonReduction: this.formBuilder.array(this.initCarbonReduction()),
      grsMaterials: this.formBuilder.array([]),
    });

    this.disableFormControls();
  }

  initCarbonReduction() {
    const carbonReductionArray = [];
    for (let i = 0; i < 12; i++) {
      const group = this.formBuilder.group({
        month: [this.getMonthName(i)],
        value: [null],
        sortOrder: [null],
      });

      // Add value change listener for conditional validation
      group.get('value').valueChanges.subscribe((value) => {
        const sortOrderControl = group.get('sortOrder');
        if (value !== null && value !== '') {
          sortOrderControl.setValidators(Validators.required);
        } else {
          sortOrderControl.clearValidators();
        }
        sortOrderControl.updateValueAndValidity();
      });

      carbonReductionArray.push(group);
    }
    return carbonReductionArray;
  }

  requiredIfValueFilled() {
    return (control: AbstractControl) => {
      const valueControl = control.parent?.get('value');
      if (valueControl?.value !== null && valueControl?.value !== '') {
        return Validators.required(control);
      } else {
        return null;
      }
    };
  }

  getMonthName(index: number) {
    const months = [
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
      'Jan',
      'Feb',
      'Mar',
    ];
    return months[index];
  }

  get carbonReductionControls() {
    return (this.dashboardForm.get('carbonReduction') as FormArray).controls;
  }

  get grsMaterialsControls() {
    return (this.dashboardForm.get('grsMaterials') as FormArray).controls;
  }

  addGRSMaterial() {
    this.showGRPUsed = true;
    const control = this.formBuilder.group({
      materialNumber: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]*$/)],
      ],
      value: [null, Validators.required],
    });
    (this.dashboardForm.get('grsMaterials') as FormArray).push(control);
  }

  removeGRSMaterial(index: number) {
    (this.dashboardForm.get('grsMaterials') as FormArray).removeAt(index);
  }

  // Get Dashboard + GRS + Carbon Data
  getDashboardDetails(branchId: any) {
    const apiUrl = this.apiUrl.apiUrl.dashboard.getDashboardMasterDetail;
    const obj = {
      BranchId: this.dashboardForm.value.BranchId,
    };
    this.commonService.doPost(apiUrl, obj).subscribe({
      next: (data) => {
        if (data.Data) {
          this.setDashboardForm(data.Data);
          this.dashboardId = data?.Data?.DashboardId;
        } else {
          this.resetDashboardForm(['BranchId']);
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

  getGRSMaterialPurchasesDetails(branchId: any) {
    const apiUrl = this.apiUrl.apiUrl.dashboard.getGRSMaterialPurchasesDetail;
    const obj = {
      BranchId: branchId,
    };
    this.commonService.doPost(apiUrl, obj).subscribe({
      next: (data) => {
        if (data.Data) {
          this.setGRSMaterialsData(data.Data);
          this.showGRPUsed = true;
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

  getCarbonReductionChartMasterDetails(branchId: any) {
    const apiUrl =
      this.apiUrl.apiUrl.dashboard.getCarbonReductionChartMasterDetail;
    const obj = {
      BranchId: branchId,
    };
    this.commonService.doPost(apiUrl, obj).subscribe({
      next: (data) => {
        if (data.Data) {
          this.staticMonths = data.Data.map((item) => item.Month);
          this.setCarbonReduction(data.Data);
          this.showCarbonReduction = true;
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

  // Set Dashboard + GRS + Carbon Data
  setCarbonReduction(data: any) {
    const staticMonths = this.staticMonths;

    (this.dashboardForm.get('carbonReduction') as FormArray).clear();
    staticMonths.forEach((month, index) => {
      const group = this.formBuilder.group({
        month: [month, Validators.required],
        value: [null],
        sortOrder: [null],
      });

      // Add value change listener for conditional validation
      group.get('value').valueChanges.subscribe((value) => {
        const sortOrderControl = group.get('sortOrder');
        if (value !== null && value !== '') {
          sortOrderControl.setValidators(Validators.required);
        } else {
          sortOrderControl.clearValidators();
        }
        sortOrderControl.updateValueAndValidity();
      });

      (this.dashboardForm.get('carbonReduction') as FormArray).push(group);
    });

    // Set values from API data if available
    if (data && data.length === staticMonths.length) {
      data.forEach((item: any, index: number) => {
        this.dashboardForm
          .get('carbonReduction')
          .get(index.toString())
          .patchValue({
            value: item.Value,
            sortOrder: item.SortOrder,
          });
      });
    }
  }

  setGRSMaterialsData(data: any) {
    (this.dashboardForm.get('grsMaterials') as FormArray).clear();
    data.forEach((item: any) => {
      const control = this.formBuilder.group({
        materialNumber: [
          item.MaterialNumber,
          [Validators.required, Validators.pattern(/^[0-9]*$/)],
        ],
        value: [item.Value, Validators.required],
      });
      (this.dashboardForm.get('grsMaterials') as FormArray).push(control);
    });
  }

  setDashboardForm(data: any) {
    this.dashboardForm.patchValue({
      BranchId: data.BranchId,
      CarbonEmission: data.CarbonEmission,
      GarmentPurchased: data.GarmentPurchased,
      LifeRecycledKG: data.LifeRecycledKG,
      ParcelDelivered: data.ParcelDelivered,
      EvPercentage: data.EVPercentage,
      SavedCO2: data.SavedCO2,
    });
  }

  get dashboardFormControl() {
    return this.dashboardForm.controls;
  }

  onSubmit() {
    if (this.dashboardForm.valid) {
      const obj = {
        ...this.dashboardForm.value,
        dashboardId: this.dashboardId,
      };
      const apiUrl = this.apiUrl.apiUrl.dashboard.saveDashboardMaster;
      this.commonService.doPost(apiUrl, obj).subscribe({
        next: (data) => {
          if (data.Success) {
            this.commonService.showNotification(
              'Dashboard',
              data.Message,
              NotificationType.SUCCESS,
            );
          } else {
            this.commonService.showNotification(
              'Dashboard',
              data.Message,
              NotificationType.ERROR,
            );
          }
        },
        error: (er) => {
          console.error(er);
        },
        complete: () => {
          console.info('complete');
        },
      });
    } else {
      // Mark all controls as touched to trigger validation messages
      this.dashboardForm.markAllAsTouched();
    }
  }

  resetDashboardForm(exclude: string[]) {
    //const exclude: string[] = ['BranchId'];
    Object.keys(this.dashboardForm.controls).forEach((key) => {
      if (exclude.findIndex((q) => q === key) === -1) {
        this.dashboardForm.get(key).reset();
      }
    });
  }
}
