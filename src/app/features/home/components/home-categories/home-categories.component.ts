import { Component, inject, signal } from '@angular/core';
import { SectionTitleComponent } from "../../../../shared/components/section-title/section-title.component";
import { CategoriesService } from '../../../../core/services/categories.service';
import { ICategory } from '../../../../core/modules/i-category.interface';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home-categories',
  imports: [SectionTitleComponent, RouterLink],
  templateUrl: './home-categories.component.html',
  styleUrl: './home-categories.component.css',
})
export class HomeCategoriesComponent {
  private readonly categoriesService = inject(CategoriesService)

  ngOnInit(): void {
    this.getAllCategories()
  }

  categoriesList = signal<ICategory[]>([])
  getAllCategories(): void {
    this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.categoriesList.set(res.data)        
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
