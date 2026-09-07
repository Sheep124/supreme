(function () {
  var menuBtn = document.querySelector("[data-menu]");
  var mobileNav = document.querySelector("[data-mobile-nav]");
  if (menuBtn && mobileNav) {
    menuBtn.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("is-open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  document.querySelectorAll("[data-nav-drop]").forEach(function (el) {
    el.addEventListener("toggle", function () {
      document.querySelectorAll("[data-nav-drop]").forEach(function (other) {
        if (other !== el) other.removeAttribute("open");
      });
    });
  });

  document.addEventListener("click", function (e) {
    var target = e.target;
    if (!target || !target.closest) return;
    if (!target.closest("[data-nav-drop]")) {
      document.querySelectorAll("[data-nav-drop]").forEach(function (el) {
        el.removeAttribute("open");
      });
    }
  });

  var form = document.querySelector("[data-value-form]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = (form.querySelector('[name="name"]') || {}).value || "";
      var kind = (form.querySelector('[name="kind"]') || {}).value || "";
      var year = (form.querySelector('[name="year"]') || {}).value || "";
      var note = (form.querySelector('[name="note"]') || {}).value || "";
      var lines = ["您好，我想咨询旧钞 / 钱币估价。"];
      if (name) lines.push("称呼：" + name);
      if (kind) lines.push("类型：" + kind);
      if (year) lines.push("年份 / 面值：" + year);
      if (note) lines.push("说明：" + note);
      lines.push("我会再补上正面、背面照片。");
      window.open(
        "https://wa.me/60127568819?text=" + encodeURIComponent(lines.join("\n")),
        "_blank",
        "noopener,noreferrer"
      );
    });
  }

  var contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = (contactForm.querySelector('[name="name"]') || {}).value || "";
      var topic = (contactForm.querySelector('[name="topic"]') || {}).value || "";
      var message = (contactForm.querySelector('[name="message"]') || {}).value || "";
      var lines = ["您好，我想咨询有关：" + topic];
      if (name) lines.push("称呼：" + name);
      if (message) lines.push("留言内容：\n" + message);
      window.open(
        "https://wa.me/60127568819?text=" + encodeURIComponent(lines.join("\n")),
        "_blank",
        "noopener,noreferrer"
      );
    });
  }

  var animObserver = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

  var animSelectors = [
    ".hero h1", ".hero p", ".hero .btn-row",
    ".page-hero h1", ".page-hero p",
    ".section h2", ".section > .wrap > p",
    ".card", ".cat", ".reason", ".article",
    ".stats > div", ".split > div", ".split > img",
    ".faq"
  ];

  document.querySelectorAll(animSelectors.join(", ")).forEach(function (el, index) {
    // Skip if element or parent has a specific reason not to animate
    if (el.closest('.no-anim')) return;
    
    el.classList.add("animate-up");
    
    // Add staggered delays for grid items
    var parent = el.parentElement;
    if (parent && (parent.classList.contains("cards") || parent.classList.contains("cats") || parent.classList.contains("reasons") || parent.classList.contains("articles") || parent.classList.contains("stats"))) {
      var children = Array.from(parent.children);
      var idx = children.indexOf(el);
      if (idx === 1) el.classList.add("delay-100");
      if (idx === 2) el.classList.add("delay-200");
      if (idx === 3) el.classList.add("delay-300");
      if (idx === 4) el.classList.add("delay-400");
      if (idx === 5) el.classList.add("delay-500");
    }

    animObserver.observe(el);
  });

  var ROUTES = [
    "/",
    "/about",
    "/recycle",
    "/valuation",
    "/trade",
    "/collection",
    "/auction",
    "/knowledge",
    "/knowledge/malaysia-old-notes-value",
    "/knowledge/how-to-judge-coin-value",
    "/knowledge/recycle-tips",
    "/knowledge/fancy-serial-numbers",
    "/knowledge/older-not-always-better",
    "/knowledge/how-to-store-banknotes",
    "/faq",
    "/contact",
  ];
  var CHANNEL = "grok-preview-bridge";
  try {
    if (window.parent !== window) {
      window.addEventListener("message", function (ev) {
        var data = ev.data;
        if (!data || data.channel !== CHANNEL || data.version !== 1) return;
        if (data.type === "navigate" && typeof data.path === "string" && data.path.charAt(0) === "/") {
          window.location.assign(data.path);
        }
        if (data.type === "history" && (data.delta === -1 || data.delta === 1)) {
          window.history.go(data.delta);
        }
        if (data.type === "hello") {
          window.parent.postMessage(
            {
              channel: CHANNEL,
              version: 1,
              type: "routes",
              paths: ROUTES,
            },
            ev.origin
          );
          window.parent.postMessage(
            {
              channel: CHANNEL,
              version: 1,
              type: "location",
              path: window.location.pathname || "/",
              search: window.location.search,
              hash: window.location.hash,
            },
            ev.origin
          );
        }
      });
    }
  } catch (err) {}
})();
