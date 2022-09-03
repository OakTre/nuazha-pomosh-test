import Swiper, {
  Navigation
} from 'swiper/swiper-bundle';

Swiper.use([Navigation]);

export default () => {
  const sliders = Array.from( document.querySelectorAll('.js-page-slider'));

  if (sliders.length === 0) return;

  sliders.forEach(slider => {
    let sliderInstance = new Swiper(slider, {
      slidesPerView: 1,
      spaceBetween: 16,
      navigation: {
        nextEl: slider.closest(".js-parent-page-slider").querySelector('.js-slider-btn-next'),
        prevEl: slider.closest(".js-parent-page-slider").querySelector('.js-slider-btn-prev'),
      },
      breakpoints: {
        280: {
          slidesPerView: 1,
          spaceBetween: 10,
        },
        767: {
          slidesPerView: Number(slider.closest(".js-parent-page-slider").dataset.slidesNumber) || 3,
          spaceBetween: 16,
        },
      }
    });
  });
};
