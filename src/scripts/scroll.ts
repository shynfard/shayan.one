import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScroll(): void {
  document.querySelectorAll<HTMLElement>('.reveal').forEach((el) => {
    gsap.from(el, {
      opacity: 0, y: 40, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 80%' },
    });
  });
  gsap.utils.toArray<HTMLElement>('.timeline-item').forEach((el, i) => {
    gsap.from(el, {
      opacity: 0, x: -30, duration: 0.6, delay: (i % 4) * 0.1, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%' },
    });
  });
}
