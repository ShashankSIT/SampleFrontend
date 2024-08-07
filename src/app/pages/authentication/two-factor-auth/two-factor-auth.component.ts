import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiUrlHelper } from 'src/app/config/apiUrlHelper';
import { NotificationType } from 'src/app/core/enums/common-enum';
import { LoginModel } from 'src/app/core/model/login-model';
import { CommonService } from 'src/app/core/services/common.service';
import { StorageKey, StorageService } from 'src/app/core/services/storage.service';

@Component({
  selector: 'app-two-factor-auth',
  templateUrl: './two-factor-auth.component.html',
  styleUrl: './two-factor-auth.component.scss'
})
export class TwoFactorAuthComponent {

  twoFactorAuthForm: FormGroup = this.formBuilder.group({});
  encryptedUserId: string = '';
  userAuthCode: string = '';
  isResendEnabled: boolean = false;
  timer: any;
  timeLeft: number = 31;
  resendCodeMessage: string = '';

  constructor(
    private commonService: CommonService,
    private apiUrl: ApiUrlHelper,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    clearTimeout(this.timer);
    const queryPara = this.route.snapshot.queryParams;
    this.encryptedUserId = this.commonService.Decrypt(queryPara['userId']);
    const verifyusercode = queryPara['auth'];
    if (verifyusercode && verifyusercode != null && verifyusercode != '') {
      this.userAuthCode = this.commonService.Decrypt(verifyusercode);
    }
    else {
      this.commonService.goToLogin();
    }
    this.initTwoFactorForm();
    this.validateUser();
  }

  initTwoFactorForm() {
    this.twoFactorAuthForm = this.formBuilder.group({
      twoFactorAuthCode: ['', [Validators.required]]
    });
  }

  get twoFactorAuthFormControl() {
    return this.twoFactorAuthForm.controls;
  }

  validateUser() {
    const apiUrl = this.apiUrl.apiUrl.login.validateTwoFactorCode;
    const obj = {
      EncryptedUserId: this.encryptedUserId,
      VerifyUser: this.userAuthCode
    };
    this.commonService.doPost(apiUrl, obj).pipe().subscribe({
      next: (data) => {
        if (data && data.Success) {
          this.resendCodeTimer();
        }
        else {
          this.storageService.clearStorage();
          this.commonService.goToLogin();
        }
      },
      error: (er) => {
        console.error(er);
      },
      complete: () => console.info('complete')
    });
  }

  resendCodeTimer() {
    this.timer = setInterval(() => this.updateResendCode(), 1000);
  }

  updateResendCode() {
    if (this.timeLeft == 0) {
      this.isResendEnabled = true;
      this.resendCodeMessage = 'You can now resend the code';
      clearTimeout(this.timer);
    } else {
      this.timeLeft -= 1;
      this.resendCodeMessage = 'You can resend the code in ' + this.timeLeft + ' seconds';
    }
  }

  onSubmit() {
    if (!this.twoFactorAuthForm.valid) {
      return false;
    }
    const apiUrl = this.apiUrl.apiUrl.login.validateTwoFactorCode;
    const obj = {
      TwoFactorCode: this.twoFactorAuthForm.value.twoFactorAuthCode,
      EncryptedUserId: this.encryptedUserId
    };
    this.commonService.doPost(apiUrl, obj).pipe().subscribe({
      next: (data) => {
        if (data && data.Success) {
          const LoginDetail: LoginModel = data.Data;
          const loginData = {
            JWTToken: LoginDetail.JWTToken,
            FirstName: LoginDetail.FirstName,
            LastName: LoginDetail.LastName,
            UserPhoto: LoginDetail.UserPhoto,
            Email: LoginDetail.Email,
            RoleName: LoginDetail.RoleName
          }
          this.storageService.setValue(StorageKey.loginData, loginData);
          this.commonService.showNotification('Login', data.Message, NotificationType.SUCCESS);
          this.router.navigate(['/home']);
        }
        else {
          this.commonService.showNotification('Two Factor Authentication', data.Message, NotificationType.ERROR);
        }
      },
      error: (er) => {
        console.error(er);
      },
      complete: () => console.info('complete')
    });

    return true;
  }

  ResendAuthCode() {
    if (this.isResendEnabled) {
      const apiUrl = this.apiUrl.apiUrl.login.resetCode;
      const objData = {
        auth: this.encryptedUserId
      };
      this.commonService.doPost(apiUrl, objData).pipe().subscribe({
        next: (data) => {
          if (data.Success) {
            this.resendCodeTimer();
            this.commonService.showNotification('Two Factor Authentication', data.Message, NotificationType.SUCCESS);
          }
          else {
            this.commonService.showNotification('Two Factor Authentication', data.Message, NotificationType.ERROR);
          }
        },
        error: (er) => {
          console.error(er)
        },
        complete: () => console.info('complete')
      });
    }
  }

  backToLogin() {
    this.commonService.goToLogin();
  }
}
