import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import AuthSignupComponent from './auth-signup/auth-signup.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { TwoFactorAuthComponent } from './two-factor-auth/two-factor-auth.component';
import { LoginWithoutPasswordComponent } from './login-without-password/login-without-password.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: AuthSignupComponent,
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'two-factor-auth',
    component: TwoFactorAuthComponent,
  },
  {
    path: 'login-without-password',
    component: LoginWithoutPasswordComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthenticationRoutingModule {}
