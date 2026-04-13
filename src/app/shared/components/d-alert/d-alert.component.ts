import { Component, input } from '@angular/core';

@Component({
  selector: 'app-d-alert',
  imports: [],
  templateUrl: './d-alert.component.html',
  styleUrl: './d-alert.component.css',
})
export class DAlertComponent {
  alertType = input<'success' | 'fail'>();
  alertmsg = input<string>();
}
