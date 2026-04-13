import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { EmailFormComponent } from "./pages/email-form/email-form.component";
import { CodeFormComponent } from "./pages/code-form/code-form.component";
import { NewPasswordFormComponent } from "./pages/new-password-form/new-password-form.component";
import { SuccessComponent } from "./pages/success/success.component";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, EmailFormComponent, CodeFormComponent, NewPasswordFormComponent, SuccessComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent implements OnInit {
  private readonly authService = inject(AuthService)
  private readonly fb = inject(FormBuilder)
  toastr = inject(ToastrService);

  stepNumber: WritableSignal<number> = signal(1);

  emailForm!: FormGroup;
  codeForm!: FormGroup;
  newPassFormUI!: FormGroup;

  rePasswordValidation: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password: string = control.get('newPassword')?.value
    const rePassword: string = control.get('rePassword')?.value
    return (password == rePassword) ? null : { passwordMatch: true }
  }
  passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$%^&*-]).{8,}$/

  ngOnInit(): void {
    this.fromInit()
  }

  fromInit(): void {
    this.emailForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]]
    })
    this.codeForm = this.fb.group({
      resetCode: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    })
    this.newPassFormUI = this.fb.group({
      newPassword: [null, [Validators.required, Validators.pattern(this.passwordRegex)]],
      rePassword: [null, [Validators.required]]
    }, {
      validators: this.rePasswordValidation
    })
  }

  isLoading: WritableSignal<boolean> = signal(false);

  sendCode(): void {
    if (this.emailForm.valid) {
      this.isLoading.set(true);
      this.authService.forgotPass(this.emailForm.value).subscribe({
        next: (res) => {
          console.log(res);
          this.stepNumber.set(2);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.toastr.error(err.error.message);
          this.isLoading.set(false);
        }
      })
    }
  }

  verifyEmail(): void {
    if (this.codeForm.valid) {
      this.isLoading.set(true);
      this.authService.verifyEmail(this.codeForm.value).subscribe({
        next: (res) => {
          console.log(res);
          this.stepNumber.set(3);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.toastr.error(err.error.message);
          this.isLoading.set(false);
        }
      })
    }
  }

  resetPass(): void {
    if (this.newPassFormUI.valid) {
      this.isLoading.set(true);

      const data = {
        email: this.emailForm.get('email')?.value,
        newPassword: this.newPassFormUI.get('newPassword')?.value
      };

      this.authService.resetPass(data).subscribe({
        next: (res) => {
          console.log(res);
          this.isLoading.set(false);
          this.stepNumber.set(4);
          this.toastr.success('Password Reset Successfully');
        },
        error: (err) => {
          console.log(err);
          this.isLoading.set(false);
        }
      })
    }
  }

}
