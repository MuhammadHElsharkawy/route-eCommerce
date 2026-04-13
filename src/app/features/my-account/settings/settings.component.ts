import { Component, inject, signal, WritableSignal } from '@angular/core';
import { InputFieldComponent } from "../../../shared/components/input-field/input-field.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SettingsService } from '../../../core/services/settings/settings.service';
import { ToastrService } from 'ngx-toastr';
import { DAlertComponent } from "../../../shared/components/d-alert/d-alert.component";

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule, InputFieldComponent, DAlertComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent {
  private readonly _settingsService = inject(SettingsService);
  private readonly _fb = inject(FormBuilder);

  isLoading: WritableSignal<boolean> = signal(false);

  userDataForm: FormGroup = this._fb.group({
    name: [null, [Validators.required]],
    email: [null, [Validators.required, Validators.email]],
    phone: [null, [Validators.required]]
  })

  userAlertType: WritableSignal<'success' | 'fail'> = signal('success');
  userAlertmsg: WritableSignal<string | null> = signal(null);
  updateUserData(): void {
    if (this.userDataForm.valid) {
      this.isLoading.set(true);
      this._settingsService.updateUserData(this.userDataForm.value).subscribe({
        next: (res) => {
          console.log(res);
          this.isLoading.set(false);
          this.userAlertType.set('success');
          this.userAlertmsg.set('Profile updated successfully')
        },
        error: (err) => {
          this.userAlertType.set('fail');
          this.userAlertmsg.set(err?.error?.errors?.msg || err?.error?.message);
          this.isLoading.set(false);
        }
      })
    }
  }

  changePasswordForm: FormGroup = this._fb.group({
    currentPassword: [null, [Validators.required]],
    password: [null, [Validators.required]],
    rePassword: [null, [Validators.required]]
  })
  passwordAlertType: WritableSignal<'success' | 'fail'> = signal('success');
  passwordAlertmsg: WritableSignal<string | null> = signal(null);
  changePassword(): void {
    if (this.changePasswordForm.valid) {
      this.isLoading.set(true);
      this._settingsService.changePassword(this.changePasswordForm.value).subscribe({
        next: (res) => {
          console.log(res);
          this.isLoading.set(false);
          this.passwordAlertType.set('success');
          this.passwordAlertmsg.set('Password updated successfully');
        },
        error: (err) => {
          this.passwordAlertType.set('fail');
          this.passwordAlertmsg.set(err?.error?.errors?.msg || err?.error?.message);
          this.isLoading.set(false);
        }
      })
    }
  }
}
