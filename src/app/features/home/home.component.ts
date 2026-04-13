import { Component } from '@angular/core';
import { HomeProductsComponent } from "./components/home-products/home-products.component";
import { HomeCategoriesComponent } from "./components/home-categories/home-categories.component";
import { HomeSliderComponent } from "./components/home-slider/home-slider.component";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home',
  imports: [HomeProductsComponent, HomeCategoriesComponent, HomeSliderComponent, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
