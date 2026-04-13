import { Component, input } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-gradient-header',
  imports: [RouterLink],
  templateUrl: './gradient-header.component.html',
  styleUrl: './gradient-header.component.css',
})
export class GradientHeaderComponent {
  bgFrom = input<string>();
  bgVia = input<string>();
  bgTo = input<string>();
  currentPage = input<string>();
  title = input<string>();
  icon = input<string | null>(null);
  img = input<string | null>(null);
  desc = input<string>();


  linksArr = input<string[]>();
}
