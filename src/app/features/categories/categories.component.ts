import { Component, inject, signal, WritableSignal } from '@angular/core';
import { GradientHeaderComponent } from "../../shared/components/gradient-header/gradient-header.component";
import { CategoriesService } from '../../core/services/categories.service';
import { ICategory } from '../../core/modules/i-category.interface';
import { ActivatedRoute, RouterLink } from "@angular/router";

@Component({
  selector: 'app-categories',
  imports: [GradientHeaderComponent, RouterLink],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent {
  private readonly _categoriesService = inject(CategoriesService);

  ngOnInit(): void {
    this.getAllCategories();
  }

  allCategories: WritableSignal<ICategory[]> = signal([]);
  isLoading: WritableSignal<boolean> = signal(false);

  getAllCategories(): void {
    this.isLoading.set(true);
    this._categoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.allCategories.set(res.data)
      },
      error: (err) => {
        this.isLoading.set(false);
        console.log(err);
      },
    })
  }

}
