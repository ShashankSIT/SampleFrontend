import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiUrlHelper } from 'src/app/config/apiUrlHelper';
import { NotificationType, RoleName } from 'src/app/core/enums/common-enum';
import { PaginationModel } from 'src/app/core/model/common-model';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-user-master',
  templateUrl: './user-master.component.html',
  styleUrl: './user-master.component.scss',
})
export class UserMasterComponent implements OnInit {
  userForm: FormGroup = this.formBuilder.group({});
  userId: number = 0;
  roleList: any[] = [];
  branchList: any[] = [];
  companyList: any[] = [];
  companyId: number = 0;
  filterParams: PaginationModel = {
    PageSize: 10,
    PageNumber: 1,
    SortColumn: '',
    SortOrder: '',
    StrSearch: '',
  };
  isNotAdmin: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private apiUrl: ApiUrlHelper,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.initUserForm();
    this.getRoleList();

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.userId = +this.commonService.Decrypt(id); // Convert id to a number
      }
    });

    this.userForm.get('roleId').valueChanges.subscribe((value) => {
      const selectedRole = this.roleList.find((role) => role.RoleId == value);
      if (selectedRole) {
        const roleName = selectedRole.RoleName;
        this.checkRole(roleName);
      }
    });

    this.userForm.get('companyId').valueChanges.subscribe((value) => {
      this.companyId = value;
      this.userForm.get('branchId').setValue(null);
      if (this.companyId > 0) {
        this.branchList = [];
        this.getBranchList(this.filterParams);
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
          if (data && data.Success) {
            this.branchList = [...this.branchList, ...data.Data];
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  getCompanyList(params: any) {
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
            this.companyList = data?.Data ?? [];
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  checkRole(roleName: string): void {
    this.isNotAdmin = roleName != RoleName.Admin;
    if (this.isNotAdmin) {
      this.getCompanyList(this.filterParams);
    }
  }

  initUserForm() {
    this.userForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      phoneNo: ['', [Validators.pattern(/^[0-9]{10,15}$/)]],
      roleId: ['', [Validators.required]],
      companyId: [null, [Validators.required]],
      branchId: [null, [Validators.required]],
    });
  }

  get userFormControl() {
    return this.userForm.controls;
  }

  getRoleList() {
    const apiUrl = this.apiUrl.apiUrl.user.getRolesList;
    this.commonService
      .doGet(apiUrl)
      .pipe()
      .subscribe({
        next: (data) => {
          if (data && data.Success) {
            this.roleList = data?.Data ?? [];
          }
          if(this.userId > 0){
            this.getUserDetails(this.userId); // Fetch user details
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  getUserDetails(userId: number) {
    const apiUrl = this.apiUrl.apiUrl.user.getUserList;
    const obj = {
      id: userId ?? 0,
    };
    this.commonService
      .doPost(apiUrl, obj)
      .pipe()
      .subscribe({
        next: (data) => {
          if (data && data.Success && data.Data.length > 0) {
            const user = data.Data[0];
            // Set Form Details
            this.userForm.setValue({
              firstName: user.FirstName,
              lastName: user.LastName,
              email: user.Email,
              password: user.Password,
              phoneNo: user.PhoneNo || '', // Handle null case
              roleId: user.RoleId,
              companyId: user.CompanyId,
              branchId: user.BranchId,
            });
          }
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  onSubmit() {
    if (!this.userForm.valid) {
      return false;
    }

    const obj = {
      ...this.userForm.value,
      UserId: this.userId,
    };
    const apiUrl = this.apiUrl.apiUrl.user.saveUser;
    this.commonService
      .doPost(apiUrl, obj)
      .pipe()
      .subscribe({
        next: (data) => {
          if (data.Success) {
            this.commonService.showNotification(
              'User',
              data.Message,
              NotificationType.SUCCESS,
            );
            this.router.navigate(['/user']);
          } else {
            this.commonService.showNotification(
              'User',
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
    return true;
  }

  onBack() {
    history.back();
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
  onScrollToEnd() {
    this.filterParams.PageNumber++;
    this.getBranchList(this.filterParams);
  }
  onCompanyChange(event: any) {
    // this.companyId = event.CompanyId;
    // if (this.companyId > 0) {
    //   this.branchList = [];
    //   this.getBranchList(this.filterParams);
    // }
  }
}
