import Lenis from "lenis";

const lenis = new Lenis({
  duration: 1.2,
  smoothWheel: true,
});

function raf(time:number) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);
