import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { AuthService } from '../../services/auth/auth.service';
import { InputFieldComponent } from "../../../../shared/components/input-field/input-field.component";
import { LoginMassegeComponent } from "../../../../shared/components/login-massege/login-massege.component";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, InputFieldComponent, LoginMassegeComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  toastr = inject(ToastrService);

  ngOnInit(): void {
    this.formInit()
  }


  rePasswordValidation: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password: string = control.get('password')?.value
    const rePassword: string = control.get('rePassword')?.value
    return (password == rePassword) ? null : { passwordMatch: true }
  }

  passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$%^&*-]).{8,}$/
  phoneRegex: RegExp = /^(2?)01[0125][0-9]{8}$/
  registerForm!: FormGroup;
  formInit(): void {
    this.registerForm = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.pattern(this.passwordRegex)]],
      rePassword: [null, [Validators.required]],
      phone: [null, [Validators.required, Validators.pattern(this.phoneRegex)]],
      agree: [false, [Validators.requiredTrue]]
    },
      {
        validators: this.rePasswordValidation
      })
  }

  test(): void {
    console.log(this.registerForm.get('agree')?.value);
    
  }
  // agreeForm: FormControl = this.fb.control({
  //   agree: [false, [Validators.required]]
  // })
  // checkAgree(): void {
  //   this.agreeForm.get('agree') = this.agreeForm.get('agree');
  //   console.log(this.agree());

  // }

  isLoading: WritableSignal<boolean> = signal(false);
  register(): void {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      this.authService.signUp(this.registerForm.value).subscribe({
        next: (res) => {
          console.log(res);
          this.router.navigate(['/login']);
          this.isLoading.set(false);
          this.toastr.success(res.message, 'FreshCart')
        },
        error: (err) => {
          this.toastr.error(err.error.message);
          this.isLoading.set(false);
        }
      })
    }
  }
}
