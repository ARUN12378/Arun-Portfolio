document.addEventListener('DOMContentLoaded', () => {
  const revealElements = document.querySelectorAll('.reveal');
  revealElements.forEach((el, idx) => {
    el.style.transitionDelay = `${Math.min(idx * 45, 360)}ms`;
  });

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

  const skillBars = document.querySelectorAll('.progress-bar');
  skillBars.forEach((bar) => {
    const target = bar.style.width;
    bar.dataset.target = target;
    bar.style.width = '0%';
  });

  const skillsSection = document.getElementById('skills');
  if (skillsSection && skillBars.length) {
    const skillObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            skillBars.forEach((bar, idx) => {
              setTimeout(() => {
                bar.style.width = bar.dataset.target || '0%';
              }, idx * 80);
            });
            skillObserver.disconnect();
          }
        });
      },
      { threshold: 0.28 }
    );

    skillObserver.observe(skillsSection);
  }

  const liftCards = document.querySelectorAll('.lift-card');
  liftCards.forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -8;
      const rotateY = ((x / rect.width) - 0.5) * 8;
      card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  const form = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');
  const submitBtn = document.getElementById('submitBtn');

  if (form && formMsg && submitBtn) {
    if (window.location.protocol === 'file:') {
      formMsg.textContent = 'Open this site using http://localhost/magento/ to submit and save leads.';
      formMsg.style.color = '#b42318';
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      formMsg.textContent = '';
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form)
        });

        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Unable to submit the form.');
        }

        formMsg.textContent = `Thanks for reaching out. Lead ID: ${result.id}`;
        formMsg.style.color = '#157347';
        form.reset();
      } catch (error) {
        formMsg.textContent = error.message || 'Submission failed. Please try again.';
        formMsg.style.color = '#b42318';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    });
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});
