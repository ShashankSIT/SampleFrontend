import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiUrlHelper } from 'src/app/config/apiUrlHelper';
import { NotificationType, RoleName } from 'src/app/core/enums/common-enum';
import { LoginModel } from 'src/app/core/model/login-model';
import { CommonService } from 'src/app/core/services/common.service';
import {
  StorageKey,
  StorageService,
} from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = this.formBuilder.group({});
  constructor(
    private formBuilder: FormBuilder,
    private storageService: StorageService,
    private commonService: CommonService,
    private apiUrl: ApiUrlHelper,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.storageService.clearStorage();
    this.initLoginForm();
  }

  initLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.maxLength(250)]],
      password: ['', [Validators.required, Validators.maxLength(250)]],
    });
  }

  get loginFormControl() {
    return this.loginForm.controls;
  }

  doLogin() {
    if (!this.loginForm.valid) {
      return false;
    }
    const apiUrl = this.apiUrl.apiUrl.login.loginUser;
    let objData = {
      Email: this.loginForm.value.email,
      Password: this.loginForm.value.password,
    };

    this.commonService
      .doPost(apiUrl, objData)
      .pipe()
      .subscribe({
        next: (data) => {
          if (data.Success && data.Data) {
            const LoginDetail: LoginModel = data.Data;
            if (LoginDetail.Is2FARequired) {
              this.commonService.showNotification(
                'Login',
                data.Message,
                NotificationType.SUCCESS,
              );
              const encryptedUserId = this.commonService.Encrypt(
                LoginDetail.EncryptedUserId,
              );
              const verifyUser = this.commonService.Encrypt(
                LoginDetail.VerifyUser,
              );
              this.router.navigate(['/auth/two-factor-auth'], {
                queryParams: { userId: encryptedUserId, auth: verifyUser },
              });
            } else {
              const loginData = {
                JWTToken: LoginDetail.JWTToken,
                FirstName: LoginDetail.FirstName,
                LastName: LoginDetail.LastName,
                UserPhoto: LoginDetail.UserPhoto,
                Email: LoginDetail.Email,
                RoleName: LoginDetail.RoleName,
                RoleId: LoginDetail.RoleId,
                BranchId: LoginDetail.BranchId
              };
              this.storageService.setValue(StorageKey.loginData, loginData);
              this.commonService.showNotification(
                'Login',
                data.Message,
                NotificationType.SUCCESS,
              );
              if (LoginDetail.RoleName == RoleName.Customer || LoginDetail.RoleName == RoleName.CustomerAdmin) {
                this.router.navigate(['/customer']);
              } else {
                this.router.navigate(['/home']);
              }
            }
          } else {
            this.commonService.showNotification(
              'Login',
              data.Message,
              NotificationType.ERROR,
            );
          }
          return;
        },
        error: (er) => {
          console.error(er);
          return;
        },
        complete: () => {
          console.info('complete');
          return;
        },
      });
    return true;
  }
}
