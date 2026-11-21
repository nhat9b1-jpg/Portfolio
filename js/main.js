/* ==========================================================================
   Main Interactive Script (WD4E Capstone Extras)
   1. Accessible Mobile Navigation Toggle
   2. Persistent Dark/Light Theme Switcher
   3. Interactive Project Category Filter (projects.html)
   4. Accessible Lightbox Preview Modal via <dialog> (projects.html)
   5. Accessible Contact Form Validation (contact.html)
   ========================================================================== */

(function () {
  "use strict";

  // 1. Mobile Navigation Toggle
  const menuToggle = document.getElementById("menu-toggle");
  const primaryNav = document.getElementById("primary-nav");

  if (menuToggle && primaryNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = primaryNav.classList.toggle("nav-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // 2. Persistent Theme Toggle (Light / Dark)
  const themeToggle = document.getElementById("theme-toggle");
  const rootEl = document.documentElement;

  function applyTheme(theme) {
    if (theme === "dark") {
      rootEl.setAttribute("data-theme", "dark");
    } else {
      rootEl.removeAttribute("data-theme");
    }

    if (themeToggle) {
      const isDark = theme === "dark";
      themeToggle.setAttribute("aria-pressed", String(isDark));
      themeToggle.innerHTML = isDark
        ? '<i class="fa-solid fa-sun" aria-hidden="true"></i> <span>Light</span>'
        : '<i class="fa-solid fa-moon" aria-hidden="true"></i> <span>Dark</span>';
    }
  }

  const savedTheme = localStorage.getItem("portfolio-theme");
  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme =
        rootEl.getAttribute("data-theme") === "dark" ? "light" : "dark";
      localStorage.setItem("portfolio-theme", nextTheme);
      applyTheme(nextTheme);
    });
  }

  // 3. Project Category Filter (projects.html)
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card[data-category]");
  const filterStatus = document.getElementById("filter-status");

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const selected = btn.dataset.filter;
        let visibleCount = 0;

        filterButtons.forEach((b) => {
          const active = b === btn;
          b.classList.toggle("active", active);
          b.setAttribute("aria-pressed", String(active));
        });

        projectCards.forEach((card) => {
          const matches =
            selected === "all" || card.dataset.category === selected;
          card.classList.toggle("is-hidden", !matches);
          if (matches) visibleCount += 1;
        });

        if (filterStatus) {
          filterStatus.textContent = `Showing ${visibleCount} project${
            visibleCount === 1 ? "" : "s"
          } in "${btn.textContent.trim()}".`;
        }
      });
    });
  }

  // 4. Accessible Lightbox Preview Modal (projects.html)
  const modal = document.getElementById("project-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalImage = document.getElementById("modal-image");
  const modalDesc = document.getElementById("modal-desc");
  const modalStack = document.getElementById("modal-stack");
  const modalClose = document.getElementById("modal-close");
  const previewButtons = document.querySelectorAll(".preview-btn");

  if (modal && previewButtons.length > 0) {
    previewButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const card = btn.closest(".project-card");
        if (!card) return;

        const img = card.querySelector(".project-thumb");
        modalTitle.textContent = btn.dataset.title || "Project Details";
        modalDesc.textContent = btn.dataset.details || "";
        modalStack.textContent = btn.dataset.stack || "";

        if (img) {
          modalImage.src = img.src;
          modalImage.alt = img.alt;
        }

        if (typeof modal.showModal === "function") {
          modal.showModal();
        }
      });
    });

    if (modalClose) {
      modalClose.addEventListener("click", () => modal.close());
    }

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.close();
      }
    });
  }

  // 5. Accessible Contact Form Validation (contact.html)
  const contactForm = document.getElementById("contact-form");
  const formFeedback = document.getElementById("form-feedback");

  if (contactForm && formFeedback) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const nameVal = document.getElementById("full-name").value.trim();
      const emailVal = document.getElementById("email-address").value.trim();
      const messageVal = document.getElementById("message-text").value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      formFeedback.className = "form-feedback";

      if (nameVal.length < 2) {
        formFeedback.textContent = "Please enter your name (at least 2 characters).";
        formFeedback.classList.add("show-error");
        document.getElementById("full-name").focus();
        return;
      }

      if (!emailPattern.test(emailVal)) {
        formFeedback.textContent = "Please enter a valid email address.";
        formFeedback.classList.add("show-error");
        document.getElementById("email-address").focus();
        return;
      }

      if (messageVal.length < 10) {
        formFeedback.textContent = "Please write a brief message (at least 10 characters).";
        formFeedback.classList.add("show-error");
        document.getElementById("message-text").focus();
        return;
      }

      formFeedback.textContent = `Thank you, ${nameVal}! Your message has been validated and recorded for demo purposes.`;
      formFeedback.classList.add("show-success");
      contactForm.reset();
    });
  }
})();