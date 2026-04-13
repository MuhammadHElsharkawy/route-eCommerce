import { Component, input } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-login-massege',
  imports: [RouterLink],
  templateUrl: './login-massege.component.html',
  styleUrl: './login-massege.component.css',
})
export class LoginMassegeComponent {
  massege = input<string>();
  desicion = input<string>();
  goTo = input<string>();
}
