import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiUrlHelper } from 'src/app/config/apiUrlHelper';
import { NotificationType } from 'src/app/core/enums/common-enum';
import { LoginModel } from 'src/app/core/model/login-model';
import { CommonService } from 'src/app/core/services/common.service';
import {
  StorageKey,
  StorageService,
} from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-login-without-password',
  templateUrl: './login-without-password.component.html',
  styleUrl: './login-without-password.component.scss',
})
export class LoginWithoutPasswordComponent implements OnInit {
  loginWithoutPasswordForm: FormGroup = this.formBuilder.group({});
  constructor(
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private apiUrl: ApiUrlHelper,
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.route.queryParams.subscribe((params) => {
      const userId = params['userId'];
      const auth = params['auth'];
      if (userId && auth) {
        this.verifyLogin(userId, auth);
      }
    });
  }
  verifyLogin(userId: string, auth: string): void {
    const apiUrl = this.apiUrl.apiUrl.login.loginUser;
    const objData = {
      EncryptedUserId: userId,
      TemporaryPassword: auth,
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
              };
              this.storageService.setValue(StorageKey.loginData, loginData);
              this.commonService.showNotification(
                'Login',
                data.Message,
                NotificationType.SUCCESS,
              );
              this.router.navigate(['/user']);
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
  }

  initForm() {
    this.loginWithoutPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required]],
    });
  }

  get loginWithoutPasswordFormControl() {
    return this.loginWithoutPasswordForm.controls;
  }

  loginWithoutPassword() {
    if (!this.loginWithoutPasswordForm.valid) {
      return false;
    }
    const apiUrl = this.apiUrl.apiUrl.login.loginWithoutPassword;
    const obj = {
      Email: this.loginWithoutPasswordForm.value.email,
    };
    this.commonService
      .doPost(apiUrl, obj)
      .pipe()
      .subscribe({
        next: (data) => {
          if (data && data.Success) {
            this.commonService.showNotification(
              'Forgot Password',
              data.Message,
              NotificationType.SUCCESS,
            );
          } else {
            this.commonService.showNotification(
              'Forgot Password',
              data.Message,
              NotificationType.ERROR,
            );
          }
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
