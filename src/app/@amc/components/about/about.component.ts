import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormFooterComponent } from '../form-footer/form-footer.component';
import Swiper from 'swiper';
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, FormFooterComponent, MatIconModule,
  ],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export default class AboutComponent {
  swiper: Swiper | undefined;
  slides = [
    { para: "The donation process is seamless and meaningful. ", name: "Poonam Gupta" },
    { para: "Quick and efficient. I highly recommend this app!", name: "Santosh Soni" },
    { para: "I found my lost wallet in just two days! Amazing service.", name: "Narayya Guptha" },
    { para: "The donation process is seamless and meaningful.", name: "Poonam Gupta" },
    { para: "Quick and efficient. I highly recommend this app!", name: "Poonam Gupta" },
    { para: "The donation process is seamless and meaningful2", name: "Poonam Gupta" },
    { para: "The donation process is seamless and meaningful.", name: "Poonam Gupta" },
  ]
  ngAfterViewInit() {
    this.swiper = new Swiper('.swiper-container', {
      slidesPerView: 3,
      // slidesPerGroup: 3,
      spaceBetween: 15,

      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      breakpoints: {
        640: {
          slidesPerView: 1,
          spaceBetween: 10,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 15,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
      },
    });
  }
}

