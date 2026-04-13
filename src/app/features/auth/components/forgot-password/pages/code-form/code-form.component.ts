import { Component, inject, input, model, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-code-form',
  imports: [ReactiveFormsModule],
  templateUrl: './code-form.component.html',
  styleUrl: './code-form.component.css',
})
export class CodeFormComponent {
  private readonly location = inject(Location)
  private readonly router = inject(Router)

  parentForm = input.required<FormGroup>();
  userEmail = input.required<string>();

  verifyEmail = output<void>();
  handleClick(): void {
    this.verifyEmail.emit();
  }

  sendCode = output<void>();
  resendCode(): void {
    this.sendCode.emit();
  }

  isLoading = input<boolean>(false);

  step = model.required<number>();
  goBack(): void{
    this.step.set(1);    
  }
}
