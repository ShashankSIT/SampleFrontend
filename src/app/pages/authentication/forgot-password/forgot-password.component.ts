import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiUrlHelper } from 'src/app/config/apiUrlHelper';
import { NotificationType } from 'src/app/core/enums/common-enum';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  forgotPasswordForm: FormGroup = this.formBuilder.group({});
  constructor(
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private apiUrl: ApiUrlHelper,
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required]],
    });
  }

  get forgotPasswordFormControl() {
    return this.forgotPasswordForm.controls;
  }

  forgotPassword() {
    if (!this.forgotPasswordForm.valid) {
      return false;
    }
    const apiUrl = this.apiUrl.apiUrl.login.forgotPassword;
    const obj = {
      Email: this.forgotPasswordForm.value.email,
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
