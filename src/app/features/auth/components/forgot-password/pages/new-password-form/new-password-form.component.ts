import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputFieldComponent } from "../../../../../../shared/components/input-field/input-field.component";

@Component({
  selector: 'app-new-password-form',
  imports: [ReactiveFormsModule, InputFieldComponent],
  templateUrl: './new-password-form.component.html',
  styleUrl: './new-password-form.component.css',
})
export class NewPasswordFormComponent {
  parentForm = input.required<FormGroup>();

  resetPass = output<void>();
  handleClick(): void {
    this.resetPass.emit();
  }

  isLoading = input<boolean>(false);
}
// private readonly forgotS = inject(ForgotPasswordService);
// private readonly fb = inject(FormBuilder);

// ngOnInit(): void {
//   this.formInit();
// }

// rePasswordValidation: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
//   const password: string = control.get('newPassword')?.value
//   const rePassword: string = control.get('rePassword')?.value
//   return (password == rePassword) ? null : { passwordMatch: true }
// }
// passwordRegex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$%^&*-]).{8,}$/

// userEmail = localStorage.getItem('userEmail');
// newPasswordForm!: FormGroup;
// formInit(): void {
//   this.newPasswordForm = this.fb.group({
//     newPassword: [null, [Validators.required, Validators.pattern(this.passwordRegex)]],
//     rePassword: [null, [Validators.required]]
//   },{
//       validators: this.rePasswordValidation
//     })
// }

// isLoading: WritableSignal<boolean> = signal(false);
// resetPassword(): void {
//   if (this.newPasswordForm.valid) {
//     const Data = {
//       email: 'muhammad.h.elsharkawy@gmail.com',
//       newPassword: this.newPasswordForm.value.newPassword
//     }
//     this.forgotS.resetPassword(Data).subscribe({
//       next: (res) => {
//         console.log(res);
        
//       },
//       error: (err) => {
//         console.log(err);
//       }
//     })
//     console.log(Data);
//   }
  
// }
