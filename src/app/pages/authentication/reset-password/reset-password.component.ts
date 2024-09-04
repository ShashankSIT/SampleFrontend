import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiUrlHelper } from 'src/app/config/apiUrlHelper';
import { NotificationType } from 'src/app/core/enums/common-enum';
import { CommonService } from 'src/app/core/services/common.service';
import {
  StorageKey,
  StorageService,
} from 'src/app/core/services/storage.service';
import { PasswordValidation } from 'src/app/core/validators/validators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup = this.formBuilder.group({});
  userId: number = 0;
  verifyUser: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  isExpireMsg: boolean = false;
  isValidURL: boolean = false;

  constructor(
    private commonService: CommonService,
    private apiUrl: ApiUrlHelper,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private storageService: StorageService,
  ) {}

  ngOnInit(): void {
    const queryPara = this.route.snapshot.queryParams;
    this.userId = queryPara['userId'];
    this.verifyUser = queryPara['auth'];
    this.validateResetPassword();
  }

  validateResetPassword() {
    const objData = {
      EncryptedUserId: this.userId,
      VerifyUser: this.verifyUser,
    };
    const apiUrl = this.apiUrl.apiUrl.login.validateResetPassword;
    this.commonService
      .doPost(apiUrl, objData)
      .pipe()
      .subscribe({
        next: (data) => {
          if (data.Success) {
            // const loginData = {
            //   JWTToken: data.TAID
            // };
            // this.storageService.setValue(StorageKey.loginData, loginData);
            this.isValidURL = true;
            this.isExpireMsg = false;
            this.initForm();
          } else {
            this.isValidURL = false;
            this.isExpireMsg = true;
          }
        },
        error: (er) => {
          console.error(er);
        },
        complete: () => console.info('complete'),
      });
  }

  initForm() {
    this.resetPasswordForm = this.formBuilder.group(
      {
        newPassword: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{12,}',
            ),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: [PasswordValidation.MatchPassword],
      },
    );
  }

  get resetPasswordFormControl() {
    return this.resetPasswordForm.controls;
  }

  showHidePassword(id: string) {
    const passwordElement = document.getElementById(id) as HTMLInputElement;
    if (passwordElement) {
      if (passwordElement.type == 'password') {
        passwordElement.type = 'text';
        this.showPassword = id == 'password' ? true : this.showPassword;
        this.showConfirmPassword =
          id == 'confirmPassword' ? true : this.showConfirmPassword;
      } else {
        passwordElement.type = 'password';
        this.showPassword = id == 'password' ? false : this.showPassword;
        this.showConfirmPassword =
          id == 'confirmPassword' ? false : this.showConfirmPassword;
      }
    }
  }

  onSubmit() {
    if (!this.resetPasswordForm.valid) {
      return false;
    }
    const objData = {
      EncryptedUserId: this.userId,
      Password: this.resetPasswordForm.value.newPassword,
      VerifyUser: this.verifyUser,
    };
    const apiUrl = this.apiUrl.apiUrl.login.resetPassword;
    this.commonService
      .doPost(apiUrl, objData)
      .pipe()
      .subscribe({
        next: (data) => {
          if (data.Success) {
            this.commonService.showNotification(
              'Reset Password',
              data.Message,
              NotificationType.SUCCESS,
            );
            localStorage.clear();
            this.commonService.goToLogin();
            //this.router.navigate(['/auth/login']);
          } else {
            this.commonService.showNotification(
              'Reset Password',
              data.Message,
              NotificationType.ERROR,
            );
          }
        },
        error: (er) => {
          console.error(er);
        },
        complete: () => console.info('complete'),
      });
    return true;
  }
}
