(() => {
  "use strict";

  const header = document.getElementById("header");
  const progress = document.getElementById("scroll-progress");
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = [...document.querySelectorAll(".nav-link")];
  const year = document.getElementById("current-year");
  const typingTarget = document.getElementById("typing-text");
  const contactForm = document.getElementById("contact-form");

  if (year) year.textContent = String(new Date().getFullYear());

  const closeMenu = () => {
    if (!menuToggle || !navMenu) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    navMenu.classList.remove("open");
    document.body.classList.remove("menu-open");
  };

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
      navMenu.classList.toggle("open", !isOpen);
      document.body.classList.toggle("menu-open", !isOpen);
    });

    navLinks.forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
    document.addEventListener("click", (event) => {
      if (navMenu.classList.contains("open") && !navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
        closeMenu();
      }
    });
  }

  let ticking = false;
  const updateScrollUI = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = scrollable > 0 ? (scrollTop / scrollable) * 100 : 0;

    if (progress) progress.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
    if (header) header.classList.toggle("scrolled", scrollTop > 24);

    const marker = scrollTop + window.innerHeight * 0.32;
    let activeId = "home";
    document.querySelectorAll("main section[id]").forEach((section) => {
      if (section.offsetTop <= marker) activeId = section.id;
    });
    navLinks.forEach((link) => {
      const active = link.getAttribute("href") === `#${activeId}`;
      link.classList.toggle("active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollUI);
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener("resize", updateScrollUI);
  updateScrollUI();

  const revealElements = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  if (typingTarget && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const phrases = ["web development", "full-stack applications", "thoughtful interfaces"];
    let phraseIndex = 0;
    let characterIndex = phrases[0].length;
    let deleting = true;

    const type = () => {
      const phrase = phrases[phraseIndex];
      if (deleting) {
        characterIndex -= 1;
      } else {
        characterIndex += 1;
      }
      typingTarget.textContent = phrase.slice(0, Math.max(0, characterIndex));

      let delay = deleting ? 38 : 68;
      if (!deleting && characterIndex === phrase.length) {
        deleting = true;
        delay = 1450;
      } else if (deleting && characterIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        delay = 320;
      }
      window.setTimeout(type, delay);
    };
    window.setTimeout(type, 1500);
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;

      const formData = new FormData(contactForm);
      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const message = String(formData.get("message") || "").trim();
      const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
      const body = encodeURIComponent(`Hello Anas,\n\n${message}\n\nBest regards,\n${name}\n${email}`);
      window.location.href = `mailto:alsapianas@gmail.com?subject=${subject}&body=${body}`;
    });
  }
})();
