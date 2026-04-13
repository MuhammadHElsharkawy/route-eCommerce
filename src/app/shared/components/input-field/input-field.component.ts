import { Component, input } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-input-field',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './input-field.component.html',
  styleUrl: './input-field.component.css',
})
export class InputFieldComponent {
  inputLabel = input<string | null>(null);
  forgotPassword = input<boolean>(false);
  inputType = input<string>('text');
  inputIcon = input<string | null>(null);
  inputPlaceHolder = input<string>('');
  inputId = input.required<string>();

  control = input<AbstractControl>();

  get formField(): FormControl {
    return this.control() as FormControl;
  }

  inputClasses(): string {
    if (this.styleType() == 'register') {
      return 'border border-[#99A1AF66] rounded-sm py-2';
    }
    else {
      return 'border-2 border-[#E5E7EB] rounded-xl font-semibold text-sm py-3';
    }
  }

  // STYLE
  styleType = input<'register' | 'login'>('login')
  labelClass = input<string>('');
}
