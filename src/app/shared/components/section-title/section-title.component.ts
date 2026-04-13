import { Component, input } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-section-title',
  imports: [RouterLink],
  templateUrl: './section-title.component.html',
  styleUrl: './section-title.component.css',
})
export class SectionTitleComponent {
  mainText = input<string>();
  highlight = input<string>();
  sideText = input<string|null>(null);
}
