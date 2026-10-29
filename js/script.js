/**
 * ============================================================
 * LOGIKA UTAMA APLIKASI PORTOFOLIO (MODULAR PATTERN)
 * ============================================================
 * Terbagi menjadi modul independen:
 * 1. Utils              : Helper DOM dan sanitasi
 * 2. ThemeManager       : Manajemen mode gelap/terang & localStorage
 * 3. NavigationManager  : Navbar scroll, mobile menu, & IntersectionObserver spy
 * 4. AnimationManager   : Animasi fade-in scroll & animasi hitung angka statistik
 * 5. CertificateManager : Filter kategori, render kartu, dan modal pratinjau
 * 6. ContactManager     : Validasi formulir kontak dan pengiriman mailto
 * 7. App                : Inisialisasi terpusat
 */

"use strict";

/* ============================================================
   1. UTILS (DOM Helpers & Security)
   ============================================================ */
const Utils = {
  $(selector, scope = document) {
    return scope.querySelector(selector);
  },

  $$(selector, scope = document) {
    return [...scope.querySelectorAll(selector)];
  },

  escapeHTML(str) {
    if (str === null || str === undefined) return "";
    return String(str).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c]));
  },
};

/* ============================================================
   2. THEME MANAGER (Dark / Light Mode)
   ============================================================ */
const ThemeManager = {
  toggleBtn: null,

  init() {
    this.toggleBtn = Utils.$("#theme-toggle");
    if (!this.toggleBtn) return;

    this.toggleBtn.addEventListener("click", () => this.toggleTheme());
  },

  applyTheme(mode) {
    const isDark = mode === "dark";
    document.documentElement.classList.toggle("dark", isDark);
    try {
      localStorage.setItem("theme", mode);
    } catch (e) {
      /* Abaikan jika localStorage diblokir oleh browser */
    }
  },

  toggleTheme() {
    const isCurrentlyDark = document.documentElement.classList.contains("dark");
    this.applyTheme(isCurrentlyDark ? "light" : "dark");
  },
};

/* ============================================================
   3. NAVIGATION MANAGER (Navbar, Mobile Menu, Active Spy)
   ============================================================ */
const NavigationManager = {
  navbar: null,
  menuToggle: null,
  mobileMenu: null,
  iconOpen: null,
  iconClose: null,
  navLinks: [],
  sections: [],

  init() {
    this.navbar = Utils.$("#navbar");
    this.menuToggle = Utils.$("#menu-toggle");
    this.mobileMenu = Utils.$("#mobile-menu");
    this.iconOpen = Utils.$("#icon-open");
    this.iconClose = Utils.$("#icon-close");
    this.navLinks = Utils.$$(".nav-link");
    this.sections = Utils.$$("main section[id]");

    this.bindScroll();
    this.bindMobileMenu();
    this.bindScrollSpy();
  },

  bindScroll() {
    if (!this.navbar) return;

    const handleScroll = () => {
      this.navbar.classList.toggle("scrolled", window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
  },

  setMenuState(isOpen) {
    if (!this.mobileMenu || !this.menuToggle) return;

    this.mobileMenu.classList.toggle("hidden", !isOpen);
    if (this.iconOpen) this.iconOpen.classList.toggle("hidden", isOpen);
    if (this.iconClose) this.iconClose.classList.toggle("hidden", !isOpen);
    this.menuToggle.setAttribute("aria-expanded", String(isOpen));
  },

  bindMobileMenu() {
    if (!this.menuToggle || !this.mobileMenu) return;

    this.menuToggle.addEventListener("click", () => {
      const isClosed = this.mobileMenu.classList.contains("hidden");
      this.setMenuState(isClosed);
    });

    Utils.$$(".mobile-link").forEach((link) => {
      link.addEventListener("click", () => this.setMenuState(false));
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 768) this.setMenuState(false);
    });
  },

  bindScrollSpy() {
    if (!("IntersectionObserver" in window) || this.sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const activeId = entry.target.id;
            this.navLinks.forEach((link) => {
              const href = link.getAttribute("href");
              link.classList.toggle("active", href === `#${activeId}`);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    this.sections.forEach((section) => observer.observe(section));
  },
};

/* ============================================================
   4. ANIMATION MANAGER (Fade-In Reveal & Counter)
   ============================================================ */
const AnimationManager = {
  prefersReducedMotion: false,

  init() {
    this.prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    this.initReveal();
    if (!this.prefersReducedMotion) {
      this.initCounters();
    }
  },

  initReveal() {
    const reveals = Utils.$$(".reveal");
    if (reveals.length === 0) return;

    if (!("IntersectionObserver" in window) || this.prefersReducedMotion) {
      reveals.forEach((el) => el.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    reveals.forEach((el, index) => {
      el.style.transitionDelay = `${(index % 3) * 80}ms`;
      observer.observe(el);
    });
  },

  animateValue(element) {
    const target = parseFloat(element.dataset.count);
    if (isNaN(target)) return;

    const decimals = Number(element.dataset.decimals || 0);
    const duration = 1200;
    const startTime = performance.now();

    const updateFrame = (currentTime) => {
      const elapsed = Math.min((currentTime - startTime) / duration, 1);
      // Easing cubic out: 1 - (1 - p)^3
      const progress = 1 - Math.pow(1 - elapsed, 3);
      element.textContent = (target * progress).toFixed(decimals);

      if (elapsed < 1) {
        requestAnimationFrame(updateFrame);
      }
    };

    requestAnimationFrame(updateFrame);
  },

  initCounters() {
    const counters = Utils.$$("[data-count]");
    if (counters.length === 0) return;

    if (!("IntersectionObserver" in window)) {
      counters.forEach((el) => {
        el.textContent = parseFloat(el.dataset.count).toFixed(Number(el.dataset.decimals || 0));
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateValue(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );

    counters.forEach((el) => observer.observe(el));
  },
};

/* ============================================================
   5. CERTIFICATE MANAGER (Filter, Render & Modal Preview)
   ============================================================ */
const CertificateManager = {
  data: [],
  activeFilter: "all",
  gridEl: null,
  filterBar: null,
  countEl: null,
  modalEl: null,
  modalPreview: null,
  modalCloseBtn: null,
  lastFocusedElement: null,

  init(certificatesData = []) {
    this.data = certificatesData;
    this.gridEl = Utils.$("#cert-grid");
    this.filterBar = Utils.$("#filter-bar");
    this.countEl = Utils.$("#filter-count");
    this.modalEl = Utils.$("#cert-modal");
    this.modalPreview = Utils.$("#modal-preview");
    this.modalCloseBtn = Utils.$("#modal-close");

    if (!this.gridEl) return;

    this.render();
    this.bindFilterEvents();
    this.bindModalEvents();
  },

  getFilteredData() {
    if (this.activeFilter === "all") return this.data;
    return this.data.filter((cert) => cert.category === this.activeFilter);
  },

  getPdfPath(cert) {
    let raw = "";
    if (cert.pdf && cert.pdf.trim() !== "") raw = cert.pdf.trim();
    else if (cert.file && cert.file.toLowerCase().endsWith(".pdf")) raw = cert.file.trim();
    else if (cert.image && cert.image.toLowerCase().endsWith(".pdf")) raw = cert.image.trim();
    if (!raw) return "";

    // Otomatis tambahkan 'assets/' jika pengguna hanya mengetikkan nama filenya
    if (!raw.startsWith("assets/") && !raw.startsWith("http://") && !raw.startsWith("https://") && !raw.startsWith("/")) {
      raw = `assets/${raw}`;
    }
    return raw;
  },

  getImagePath(cert) {
    let raw = "";
    if (cert.image && !cert.image.toLowerCase().endsWith(".pdf")) raw = cert.image.trim();
    if (!raw) return "";

    // Otomatis tambahkan 'assets/' jika pengguna hanya mengetikkan nama filenya
    if (!raw.startsWith("assets/") && !raw.startsWith("http://") && !raw.startsWith("https://") && !raw.startsWith("/")) {
      raw = `assets/${raw}`;
    }
    return raw;
  },

  createCardHTML(cert) {
    const title = Utils.escapeHTML(cert.title);
    const issuer = Utils.escapeHTML(cert.issuer);
    const date = Utils.escapeHTML(cert.date);
    const label = Utils.escapeHTML(cert.categoryLabel);
    const pdfPath = this.getPdfPath(cert);
    const hasPdf = Boolean(pdfPath);

    return `
      <button type="button" class="card cert-card" data-id="${cert.id}" aria-label="Lihat detail sertifikat ${title}">
        <div class="flex items-start justify-between mb-3">
          <div class="icon-box !mb-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4M7.8 4.7a3.4 3.4 0 001.9-.8 3.4 3.4 0 014.6 0 3.4 3.4 0 001.9.8 3.4 3.4 0 013.1 3.1c.1.7.4 1.4.8 1.9a3.4 3.4 0 010 4.6 3.4 3.4 0 00-.8 1.9 3.4 3.4 0 01-3.1 3.1 3.4 3.4 0 00-1.9.8 3.4 3.4 0 01-4.6 0 3.4 3.4 0 00-1.9-.8 3.4 3.4 0 01-3.1-3.1 3.4 3.4 0 00-.8-1.9 3.4 3.4 0 010-4.6 3.4 3.4 0 00.8-1.9 3.4 3.4 0 013.1-3.1z"/>
            </svg>
          </div>
          ${hasPdf ? `
            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/25">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
              PDF
            </span>
          ` : ""}
        </div>
        <span class="tag">${label}</span>
        <h3 class="card-title">${title}</h3>
        <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">${issuer}</p>
        <p class="mt-1 text-sm font-semibold text-accent-dark dark:text-accent">${date}</p>
        <p class="mt-3 text-xs font-semibold text-accent-dark dark:text-accent">Lihat pratinjau &rarr;</p>
      </button>
    `;
  },

  render() {
    const list = this.getFilteredData();
    this.gridEl.innerHTML = list.map((cert) => this.createCardHTML(cert)).join("");

    if (this.countEl) {
      this.countEl.textContent = `Menampilkan ${list.length} dari ${this.data.length} sertifikat`;
    }
  },

  bindFilterEvents() {
    if (!this.filterBar) return;

    this.filterBar.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;

      this.activeFilter = btn.dataset.filter || "all";

      Utils.$$(".filter-btn", this.filterBar).forEach((b) => {
        b.classList.toggle("active", b === btn);
      });

      this.render();
    });
  },

  openModal(cert) {
    if (!this.modalEl) return;

    this.lastFocusedElement = document.activeElement;

    const titleEl = Utils.$("#modal-title", this.modalEl);
    const issuerEl = Utils.$("#modal-issuer", this.modalEl);
    const dateEl = Utils.$("#modal-date", this.modalEl);
    const descEl = Utils.$("#modal-desc", this.modalEl);
    const categoryEl = Utils.$("#modal-category", this.modalEl);
    const actionsEl = Utils.$("#modal-actions", this.modalEl);

    if (titleEl) titleEl.textContent = cert.title;
    if (issuerEl) issuerEl.textContent = cert.issuer;
    if (dateEl) dateEl.textContent = cert.date;
    if (descEl) descEl.textContent = cert.description;
    if (categoryEl) categoryEl.textContent = cert.categoryLabel;

    const pdfPath = this.getPdfPath(cert);
    const imagePath = this.getImagePath(cert);

    // Pratinjau Gambar atau Icon PDF
    if (this.modalPreview) {
      if (imagePath) {
        this.modalPreview.innerHTML = `
          <img src="${Utils.escapeHTML(imagePath)}" 
               alt="Sertifikat: ${Utils.escapeHTML(cert.title)}" 
               class="w-full h-full object-contain bg-white" />
        `;
      } else if (pdfPath) {
        this.modalPreview.innerHTML = `
          <div class="text-white text-center p-6">
            <div class="w-16 h-16 mx-auto rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 mb-3 shadow-lg shadow-red-500/10">
              <svg class="w-9 h-9" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/30 tracking-wider uppercase">Dokumen Resmi PDF</span>
            <p class="mt-3 font-semibold text-sm max-w-sm mx-auto text-slate-100">${Utils.escapeHTML(cert.title)}</p>
            <p class="mt-1 text-xs text-slate-400">Klik tombol di bawah untuk membuka &amp; membaca dokumen asli</p>
          </div>
        `;
      } else {
        this.modalPreview.innerHTML = `
          <div class="text-white text-center p-6">
            <svg class="w-14 h-14 mx-auto text-accent" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.6-.4A9 9 0 113 12a9 9 0 0118 0z"/>
            </svg>
            <p class="mt-4 text-xs uppercase tracking-widest text-accent font-semibold">Sertifikat Resmi</p>
            <p class="mt-2 font-semibold px-4">${Utils.escapeHTML(cert.title)}</p>
            <p class="mt-2 text-xs text-slate-400">File dokumen PDF belum ditambahkan</p>
          </div>
        `;
      }
    }

    // Tombol Aksi Buka PDF
    if (actionsEl) {
      if (pdfPath) {
        actionsEl.classList.remove("hidden");
        const safeUrl = encodeURI(pdfPath);
        actionsEl.innerHTML = `
          <a href="${Utils.escapeHTML(safeUrl)}" target="_blank" rel="noopener noreferrer" 
             class="btn-primary w-full sm:w-auto text-sm inline-flex items-center justify-center gap-2 !bg-red-600 hover:!bg-red-700 !text-white !shadow-red-600/30">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Buka Dokumen PDF (Tab Baru)
          </a>
        `;
      } else {
        actionsEl.classList.add("hidden");
        actionsEl.innerHTML = "";
      }
    }

    this.modalEl.classList.add("open");
    this.modalEl.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    if (this.modalCloseBtn) this.modalCloseBtn.focus();
  },

  closeModal() {
    if (!this.modalEl) return;

    this.modalEl.classList.remove("open");
    this.modalEl.classList.add("hidden");
    document.body.style.overflow = "";

    if (this.lastFocusedElement) {
      this.lastFocusedElement.focus();
    }
  },

  bindModalEvents() {
    if (!this.modalEl) return;

    // Klik kartu di dalam grid
    this.gridEl.addEventListener("click", (e) => {
      const card = e.target.closest(".cert-card");
      if (!card) return;
      const certId = Number(card.dataset.id);
      const cert = this.data.find((c) => c.id === certId);
      if (cert) this.openModal(cert);
    });

    // Tombol close & backdrop
    if (this.modalCloseBtn) {
      this.modalCloseBtn.addEventListener("click", () => this.closeModal());
    }

    const backdrop = Utils.$("#modal-backdrop", this.modalEl);
    if (backdrop) {
      backdrop.addEventListener("click", () => this.closeModal());
    }

    // Keyboard ESC listener
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.modalEl.classList.contains("open")) {
        this.closeModal();
      }
    });
  },
};

/* ============================================================
   6. CONTACT MANAGER (Form Validation & Mailto Action)
   ============================================================ */
const ContactManager = {
  form: null,
  statusEl: null,
  fields: [],
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,

  validators: {
    name(val) {
      const trimmed = val.trim();
      if (!trimmed) return "Nama wajib diisi.";
      if (trimmed.length < 2) return "Nama minimal 2 karakter.";
      return "";
    },
    email(val) {
      const trimmed = val.trim();
      if (!trimmed) return "Email wajib diisi.";
      if (!ContactManager.EMAIL_REGEX.test(trimmed)) {
        return "Format email tidak valid (contoh: nama@domain.com).";
      }
      return "";
    },
    message(val) {
      const trimmed = val.trim();
      if (!trimmed) return "Pesan wajib diisi.";
      if (trimmed.length < 10) return "Pesan minimal 10 karakter.";
      return "";
    },
  },

  init() {
    this.form = Utils.$("#contact-form");
    this.statusEl = Utils.$("#form-status");
    if (!this.form) return;

    this.fields = Utils.$$("input, textarea", this.form);
    this.bindEvents();
  },

  validateField(input) {
    const validator = this.validators[input.name];
    if (!validator) return true;

    const errorMsg = validator(input.value);
    const errorEl = Utils.$(`[data-error-for="${input.name}"]`, this.form);

    if (errorEl) {
      errorEl.textContent = errorMsg;
    }

    const hasError = Boolean(errorMsg);
    input.classList.toggle("invalid", hasError);
    input.classList.toggle("valid", !hasError && input.value.trim() !== "");
    input.setAttribute("aria-invalid", String(hasError));

    return !hasError;
  },

  bindEvents() {
    this.fields.forEach((input) => {
      input.addEventListener("blur", () => this.validateField(input));
      input.addEventListener("input", () => {
        if (input.classList.contains("invalid")) {
          this.validateField(input);
        }
      });
    });

    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
  },

  handleSubmit(e) {
    e.preventDefault();
    if (!this.statusEl) return;

    this.statusEl.className = "text-sm font-medium hidden";

    const results = this.fields.map((field) => this.validateField(field));
    const hasInvalid = results.includes(false);

    if (hasInvalid) {
      const firstInvalid = this.fields.find((f) => f.classList.contains("invalid"));
      if (firstInvalid) firstInvalid.focus();

      this.statusEl.textContent = "Mohon periksa kembali isian formulir.";
      this.statusEl.className = "text-sm font-medium text-red-500";
      return;
    }

    // Siapkan mailto client-side
    const formData = new FormData(this.form);
    const name = (formData.get("name") || "").toString().trim();
    const email = (formData.get("email") || "").toString().trim();
    const message = (formData.get("message") || "").toString().trim();

    const subject = encodeURIComponent(`Pesan dari ${name} (Portofolio QA)`);
    const body = encodeURIComponent(`Nama: ${name}\nEmail: ${email}\n\nPesan:\n${message}`);

    window.location.href = `mailto:izzannuhaz@gmail.com?subject=${subject}&body=${body}`;

    this.statusEl.textContent = "Terima kasih! Aplikasi email Anda akan terbuka untuk mengirim pesan.";
    this.statusEl.className = "text-sm font-medium text-emerald-500";

    this.form.reset();
    this.fields.forEach((f) => f.classList.remove("valid", "invalid"));
  },
};

/* ============================================================
   7. LIGHTBOX MANAGER (Perbesar Foto Dokumentasi Pengalaman)
   ============================================================ */
const LightboxManager = {
  lightboxEl: null,
  lightboxImg: null,
  lightboxCaption: null,
  closeBtn: null,
  lastFocused: null,

  init() {
    this.lightboxEl = Utils.$("#image-lightbox");
    this.lightboxImg = Utils.$("#lightbox-img");
    this.lightboxCaption = Utils.$("#lightbox-caption");
    this.closeBtn = Utils.$("#lightbox-close");

    if (!this.lightboxEl) return;

    // Delegasi klik pada slot foto yang aktif (bukan placeholder kosong)
    document.addEventListener("click", (e) => {
      const slot = e.target.closest(".photo-slot");
      if (!slot || slot.classList.contains("has-placeholder")) return;

      const img = slot.querySelector("img");
      const src = slot.dataset.lightbox || (img ? img.getAttribute("src") : "");
      const caption = slot.dataset.caption || (img ? img.getAttribute("alt") : "");

      if (src) this.open(src, caption);
    });

    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.close());
    }

    this.lightboxEl.addEventListener("click", (e) => {
      if (e.target === this.lightboxEl) this.close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !this.lightboxEl.classList.contains("hidden")) {
        this.close();
      }
    });
  },

  open(src, caption) {
    if (!this.lightboxEl || !this.lightboxImg) return;
    this.lastFocused = document.activeElement;
    this.lightboxImg.src = src;
    if (this.lightboxCaption) this.lightboxCaption.textContent = caption || "";
    this.lightboxEl.classList.remove("hidden");
    this.lightboxEl.classList.add("open");
    document.body.style.overflow = "hidden";
    if (this.closeBtn) this.closeBtn.focus();
  },

  close() {
    if (!this.lightboxEl) return;
    this.lightboxEl.classList.remove("open");
    this.lightboxEl.classList.add("hidden");
    document.body.style.overflow = "";
    if (this.lightboxImg) this.lightboxImg.src = "";
    if (this.lastFocused) this.lastFocused.focus();
  },
};

/* ============================================================
   8. INITIALIZATION (Entry Point)
   ============================================================ */
const App = {
  init() {
    ThemeManager.init();
    NavigationManager.init();
    AnimationManager.init();

    const certData = (typeof PORTFOLIO_DATA !== "undefined" && PORTFOLIO_DATA.certificates)
      ? PORTFOLIO_DATA.certificates
      : [];
    CertificateManager.init(certData);

    ContactManager.init();
    LightboxManager.init();

    // Set tahun footer otomatis
    const yearEl = Utils.$("#year");
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  },
};

// Jalankan ketika DOM sudah siap
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => App.init());
} else {
  App.init();
}
