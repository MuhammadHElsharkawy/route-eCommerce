import { Component, input, signal, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-rating-stars',
  imports: [],
  templateUrl: './rating-stars.component.html',
  styleUrl: './rating-stars.component.css',
})
export class RatingStarsComponent {
  ratingsAverage = input<number>()
  ratingsQuantity = input<number>()
  row = input<boolean>(true)
  massage = input<'short'|'long'>('short')

  ngOnInit(): void {
    this.handleStars();
  }
  
  fullStarts: WritableSignal<number> = signal(0);
  fractionStarts: WritableSignal<number> = signal(0);
  emptyStarts: WritableSignal<number> = signal(0);
  isFractionStar: WritableSignal<boolean> = signal(false);

  handleStars(): void {
    this.fullStarts.set(Math.floor(this.ratingsAverage()!))
    this.fractionStarts.set( Math.round(( this.ratingsAverage()! - Math.floor(this.ratingsAverage()! ) ) * 10) );
    if(this.fractionStarts() >= 5) {
      this.emptyStarts.set(5 - this.fullStarts() - 1)
      this.isFractionStar.set(true);
    } else {
      this.emptyStarts.set(5 - this.fullStarts())
      this.isFractionStar.set(false);
    }
  }
}
