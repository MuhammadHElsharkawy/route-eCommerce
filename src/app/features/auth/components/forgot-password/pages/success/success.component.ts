import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success',
  imports: [],
  templateUrl: './success.component.html',
  styleUrl: './success.component.css',
})
export class SuccessComponent {
  private readonly router = inject(Router)

  goToSignIn(): void {
    this.router.navigate(['/login']);
  }
}
