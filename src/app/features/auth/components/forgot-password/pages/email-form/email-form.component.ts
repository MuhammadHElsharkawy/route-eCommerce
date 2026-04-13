import { Component, input, output } from '@angular/core';
import { InputFieldComponent } from "../../../../../../shared/components/input-field/input-field.component";
import { RouterLink } from "@angular/router";
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginMassegeComponent } from "../../../../../../shared/components/login-massege/login-massege.component";

@Component({
  selector: 'app-email-form',
  imports: [InputFieldComponent, ReactiveFormsModule, RouterLink, LoginMassegeComponent],
  templateUrl: './email-form.component.html',
  styleUrl: './email-form.component.css',
})
export class EmailFormComponent {
  parentForm = input.required<FormGroup>();

  sendCode = output<void>();
  handleClick(): void {
    this.sendCode.emit();
  }

  isLoading = input<boolean>(false);
}
