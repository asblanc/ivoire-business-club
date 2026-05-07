import AOS from 'aos';
import 'aos/dist/aos.css';
import { CountUp } from 'countup.js';

export const initIBCAnimations = () => {
  // 1. PRELOADER
  const initPreloader = () => {
    const preloader = document.createElement('div');
    preloader.id = 'ibc-preloader';
    preloader.style.cssText = `
      position: fixed;
      inset: 0;
      background: #1B5E35;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      transition: opacity 0.5s ease-out;
    `;

    const logo = document.createElement('div');
    logo.textContent = 'IBC';
    logo.style.cssText = `
      font-family: 'Playfair Display', serif;
      font-weight: 900;
      font-size: 48px;
      color: #C9A84C;
      margin-bottom: 20px;
    `;

    const spinner = document.createElement('div');
    spinner.style.cssText = `
      width: 40px;
      height: 40px;
      border: 3px solid rgba(201, 168, 76, 0.1);
      border-top: 3px solid #C9A84C;
      border-radius: 50%;
      animation: ibc-spin 1s linear infinite;
    `;

    const style = document.createElement('style');
    style.textContent = `
      @keyframes ibc-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;

    preloader.appendChild(logo);
    preloader.appendChild(spinner);
    document.body.appendChild(preloader);
    document.head.appendChild(style);

    setTimeout(() => {
      preloader.style.opacity = '0';
      setTimeout(() => preloader.remove(), 500);
    }, 1200);
  };

  // 2. AOS INIT
  const initAOS = () => {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      once: true
    });

    // Auto-apply aos to certain elements
    const cards = document.querySelectorAll('.card, .section-block, h2');
    cards.forEach((el, i) => {
      if (!el.hasAttribute('data-aos')) {
        el.setAttribute('data-aos', 'fade-up');
        el.setAttribute('data-aos-delay', (100 * (i % 3 + 1)).toString());
      }
    });
  };

  // 3. COUNTERS
  const initCounters = () => {
    const counterElements = document.querySelectorAll('[data-countup]');
    counterElements.forEach(el => {
      const endVal = parseInt(el.getAttribute('data-countup') || '0');
      const suffix = el.getAttribute('data-suffix') || '';
      const countUp = new CountUp(el as HTMLElement, endVal, {
        suffix: suffix,
        duration: 2,
        useEasing: true,
      });
      if (!countUp.error) {
        countUp.start();
      }
    });
  };

  // 4. CARDS HOVER
  const initHoverEffects = () => {
    const partnerCards = document.querySelectorAll('.partner-card');
    partnerCards.forEach(card => {
      const htmlCard = card as HTMLElement;
      htmlCard.style.transition = 'all 0.3s ease-out';
      
      htmlCard.addEventListener('mouseover', () => {
        htmlCard.style.transform = 'translateY(-6px)';
        htmlCard.style.boxShadow = '0 16px 40px rgba(201,168,76,0.25)';
      });

      htmlCard.addEventListener('mouseleave', () => {
        htmlCard.style.transform = 'translateY(0)';
        htmlCard.style.boxShadow = 'none';
      });
    });
  };

  // Execute all
  const runAll = () => {
    initPreloader();
    initAOS();
    initCounters();
    initHoverEffects();
  };

  if (document.readyState === 'complete') {
    runAll();
  } else {
    window.addEventListener('load', runAll);
  }

  // Handle dynamic content
  window.addEventListener('ibc-content-ready', () => {
    initCounters();
    initAOS();
  });
};
