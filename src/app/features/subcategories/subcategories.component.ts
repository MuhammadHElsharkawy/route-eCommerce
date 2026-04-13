import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { GradientHeaderComponent } from "../../shared/components/gradient-header/gradient-header.component";
import { CategoriesService } from '../../core/services/categories.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ISubCategory } from '../../core/modules/i-subcategory.interface';
import { ICategory } from '../../core/modules/i-category.interface';

@Component({
  selector: 'app-subcategories',
  imports: [GradientHeaderComponent, RouterLink],
  templateUrl: './subcategories.component.html',
  styleUrl: './subcategories.component.css',
})
export class SubcategoriesComponent implements OnInit {
  private readonly _categoriesService = inject(CategoriesService);
  private readonly _activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe((param) => {
      this.categoryId.set(param.get('id'));
      if (this.categoryId()) {
        this.getCategory();
        this.getCategorySubCategories(this.categoryId()!);
      }
    })
  }

  categoryId: WritableSignal<string | null> = signal(null);
  category: WritableSignal<ICategory | null> = signal(null);
  allSubCategories: WritableSignal<ISubCategory[]> = signal([]);
  isLoading: WritableSignal<boolean> = signal(false);

  getCategorySubCategories(categoryId: string): void {
    this.isLoading.set(true);
    this._categoriesService.getCategorySubCategories(categoryId).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.allSubCategories.set(res.data)
      },
      error: (err) => {
        this.isLoading.set(false);
        console.log(err);
      },
    })
  }

  getCategory(): void {
    this._categoriesService.getSpecificCategory(this.categoryId()!).subscribe({
      next: (res) => {
        this.category.set(res.data);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
