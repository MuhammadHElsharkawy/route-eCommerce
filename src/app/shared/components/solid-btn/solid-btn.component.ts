import { Component, input } from '@angular/core';

@Component({
  selector: 'app-solid-btn',
  imports: [],
  templateUrl: './solid-btn.component.html',
  styleUrl: './solid-btn.component.css',
})
export class SolidBtnComponent {
  mainText = input<string>('');
  loadingText = input<string>('');
  btnIcon = input<string|null>(null);
  isLoading = input<boolean>(false);
  isDisabled = input<boolean>(false);
}
