document.addEventListener('DOMContentLoaded', () => {
  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((el) => observer.observe(el));

  const form = document.querySelector('.contact-form');
  const formMsg = document.getElementById('formMsg');
  if (form && formMsg) {
    form.addEventListener('submit', () => {
      formMsg.textContent = 'Thanks for reaching out. I will get back to you shortly.';
      form.reset();
    });
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});
