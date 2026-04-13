import { afterNextRender, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home-slider',
  imports: [RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home-slider.component.html',
  styleUrl: './home-slider.component.css',
})
export class HomeSliderComponent implements OnInit {
  ngOnInit(): void {
    register();
  }

  @ViewChild('homeSwiper') homeSwiper!: ElementRef;
  
  swiperLeft(): void {
    this.homeSwiper.nativeElement.swiper.slidePrev();
  }
  swiperRight(): void {
    this.homeSwiper.nativeElement.swiper.slideNext();
  }

  activeIndex = signal(0);
  totalSlides = signal(3);

  constructor() {
    afterNextRender(() => {
      const swiperEl = this.homeSwiper.nativeElement;
      
      swiperEl.addEventListener('swiperslidechange', (event: any) => {
        const [swiper] = event.detail;
        this.activeIndex.set(swiper.realIndex);
      });
    });
  }

  goToSlide(index: number) {
    this.homeSwiper.nativeElement.swiper.slideTo(index);
  }

}
