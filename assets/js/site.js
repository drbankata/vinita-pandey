/* =====================================================================
   VINITA PANDEY · Homeopathy · site script (no libraries, no build step)
   Progressive enhancement: every page reads fine without JavaScript.
   ===================================================================== */
(function () {
  "use strict";
  var doc = document.documentElement;
  doc.classList.add("js");
  var ROOT = doc.getAttribute("data-root") || "";   /* "" on the home page, "../" in sub-folders */
  var NL = String.fromCharCode(10);

  /* ---------- SETTINGS (edit here) ----------
     Anything left empty simply stays hidden on the site.                                     */
  var EMAIL       = "Vinitapandey@hotmail.co.uk";   /* from her current website */
  var PHONE       = "07757 706572";                 /* as shown; from her current website */
  var WHATSAPP    = "";   /* digits only with country code, e.g. "447757706572" — fill ONLY once Vinita confirms she uses WhatsApp on this number */
  var CLINIC      = "The Health Zone Clinic, 30 Wimbledon Hill Road, Wimbledon, London SW19 7PA";
  var BOOKING_URL = "";   /* optional online diary (Calendly / Cal.com / Acuity / Fresha). Adds "Pick a time online" buttons */
  var SEND_URL    = "";   /* optional: FormSubmit endpoint, e.g. "https://formsubmit.co/ajax/Vinitapandey@hotmail.co.uk" (needs a one-time Activate click in her inbox). Empty = forms open the visitor's email app / WhatsApp */
  var FORM_URL    = "";   /* optional Google Form link (used only if SEND_URL is empty) */
  /* Online payment links per consultation (Stripe Payment Links / PayPal.me / SumUp / Square).
     When a link is filled in, "Pay online" appears on that consultation and in the booking step. */
  var PAYMENT = {
    "discovery":   "",   /* free — normally stays empty */
    "first-adult": "",
    "first-child": "",
    "follow-up":   "",
    "acute":       "",
    "care-plan":   "",
    "gift":        ""
  };
  var BANK_DETAILS = "";  /* optional bank-transfer line shown after booking, e.g. "V Pandey · 00-00-00 · 00000000" (public!) */
  var INSTAGRAM = "https://www.instagram.com/vinitapandeyhomeopathy/";
  var FACEBOOK  = "https://www.facebook.com/VinitaPandeyHomeopathy";
  var TWITTER   = "https://twitter.com/VinitaPandey24";
  var LINKEDIN  = "https://www.linkedin.com/in/vinita-pandey-5122bb1aa/";
  var YOUTUBE   = "https://www.youtube.com/@vinitapandeyhealwithhomeop3955";
  var SITE = "https://drbankata.github.io/vinita-pandey/";

  /* Consultation names + sample prices (keep in step with the HTML cards) */
  var SERVICES = {
    "discovery":   { name: "Free 15-minute discovery call", price: "Free" },
    "first-adult": { name: "First consultation — adults", price: "£95" },
    "first-child": { name: "First consultation — children", price: "£75" },
    "follow-up":   { name: "Follow-up consultation", price: "£55" },
    "acute":       { name: "Acute consultation", price: "£35" },
    "care-plan":   { name: "Four-month care plan", price: "£230" },
    "gift":        { name: "Gift a consultation", price: "from £55" }
  };

  /* ---------- helpers ---------- */
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function ref() { var d = new Date(); return "VP-" + String(d.getMonth() + 1).padStart(2, "0") + String(d.getDate()).padStart(2, "0") + "-" + Math.floor(100 + Math.random() * 900); }
  function store(k, v) { try { if (v === undefined) return JSON.parse(sessionStorage.getItem(k) || "null"); sessionStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }

  /* ---------- Contact details: show only what has been filled in ---------- */
  var LINKS = {
    email: EMAIL && "mailto:" + EMAIL,
    phone: PHONE && "tel:" + PHONE.replace(/[^+0-9]/g, ""),
    whatsapp: WHATSAPP && "https://wa.me/" + WHATSAPP,
    booking: BOOKING_URL, instagram: INSTAGRAM, facebook: FACEBOOK, twitter: TWITTER, linkedin: LINKEDIN, youtube: YOUTUBE,
    bank: BANK_DETAILS
  };
  var TEXT = { email: EMAIL, phone: PHONE, whatsapp: PHONE || (WHATSAPP && "+" + WHATSAPP), bank: BANK_DETAILS, clinic: CLINIC };
  function external(a, url) { a.href = url; if (/^https?:/.test(url)) { a.target = "_blank"; a.rel = "noopener"; } }
  function applyShow(scope) {
    $$("[data-show]", scope).forEach(function (el) {
      var k = el.getAttribute("data-show");
      if (!LINKS[k]) { el.hidden = true; return; }
      el.hidden = false;
      if (el.tagName === "A" && k !== "bank") external(el, LINKS[k]);
      $$("[data-fill]", el).forEach(function (f) { if (TEXT[k]) f.textContent = TEXT[k]; });
    });
    $$("[data-pay]", scope).forEach(function (el) {
      var url = PAYMENT[el.getAttribute("data-pay")];
      if (!url) { el.hidden = true; return; }
      el.hidden = false; external(el, url);
    });
  }
  applyShow();
  $$("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Mobile menu ---------- */
  var toggle = $(".menu-btn"), nav = $("#site-nav");
  var ICON_OPEN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h10"/></svg><span class="sr-only">Open menu</span>';
  var ICON_CLOSE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg><span class="sr-only">Close menu</span>';
  if (toggle && nav) {
    var setOpen = function (open) { nav.classList.toggle("open", open); toggle.setAttribute("aria-expanded", open ? "true" : "false"); toggle.innerHTML = open ? ICON_CLOSE : ICON_OPEN; };
    toggle.addEventListener("click", function () { setOpen(!nav.classList.contains("open")); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) setOpen(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && nav.classList.contains("open")) { setOpen(false); toggle.focus(); } });
    addEventListener("resize", function () { if (innerWidth >= 1100 && nav.classList.contains("open")) setOpen(false); });
  }

  /* ---------- Header shadow, reading progress, back-to-top, mobile bar ---------- */
  var header = $(".site-header"), bar = $(".progress"), toTop = $(".to-top"), mbar = $(".mbar");
  function onScroll() {
    var y = window.scrollY, h = doc.scrollHeight - innerHeight;
    if (header) header.classList.toggle("scrolled", y > 8);
    if (bar) bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    if (toTop) toTop.classList.toggle("show", y > 900);
    if (mbar) mbar.classList.toggle("show", y > 520 && (h - y) > 260);
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  if (toTop) toTop.addEventListener("click", function () { scrollTo({ top: 0, behavior: "smooth" }); });

  /* ---------- Toast ---------- */
  var toast = document.createElement("div"); toast.className = "toast"; toast.setAttribute("role", "status"); toast.setAttribute("aria-live", "polite");
  document.body.appendChild(toast);
  var tt;
  function say(t) { toast.textContent = t; toast.classList.add("show"); clearTimeout(tt); tt = setTimeout(function () { toast.classList.remove("show"); }, 3200); }

  /* ---------- Dialog helpers ---------- */
  var lastFocus;
  function openDlg(d) { if (!d) return; lastFocus = document.activeElement; if (d.showModal) { if (!d.open) d.showModal(); } else d.setAttribute("open", ""); }
  function closeDlg(d) { if (!d) return; if (d.close) d.close(); else d.removeAttribute("open"); if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  $$("dialog").forEach(function (d) {
    d.addEventListener("click", function (e) { if (e.target === d) closeDlg(d); });
    $$("[data-close]", d).forEach(function (b) { b.addEventListener("click", function () { closeDlg(d); }); });
  });

  /* ---------- Materia medica: scroll buttons + plate viewer ---------- */
  var track = $(".mm-track");
  $$("[data-mm]").forEach(function (b) {
    b.addEventListener("click", function () { if (track) track.scrollBy({ left: (b.getAttribute("data-mm") === "next" ? 1 : -1) * 600, behavior: "smooth" }); });
  });
  var plateDlg = $("#plate-dlg");
  $$(".mm-card").forEach(function (c) {
    c.addEventListener("click", function () {
      if (!plateDlg) return;
      $(".pv-img img", plateDlg).src = c.getAttribute("data-full");
      $(".pv-img img", plateDlg).alt = c.getAttribute("data-alt") || "";
      $(".latin", plateDlg).textContent = c.getAttribute("data-latin");
      $(".common", plateDlg).textContent = c.getAttribute("data-common");
      $(".story", plateDlg).textContent = c.getAttribute("data-story");
      openDlg(plateDlg);
    });
  });

  /* ---------- Video: load YouTube only when asked (privacy + speed) ---------- */
  $$("[data-yt]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var box = btn.parentNode, id = btn.getAttribute("data-yt");
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
      f.title = btn.getAttribute("aria-label") || "Video";
      f.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      f.allowFullscreen = true;
      box.innerHTML = ""; box.appendChild(f);
    });
  });

  /* =================================================================
     BOOKING + CONTACT (no backend needed)
     ================================================================= */
  var sendDlg = $("#send-dlg");
  var lastMsg = { subject: "", body: "", service: "" };

  /* Pre-select a consultation: ?service=first-adult in the URL, or any [data-book] button */
  var sel = $("#bk-service");
  function pick(id) {
    if (!sel || !SERVICES[id]) return;
    sel.value = id; sel.dispatchEvent(new Event("change"));
  }
  if (sel) {
    var qs = new URLSearchParams(location.search).get("service");
    if (qs) pick(qs);
    sel.addEventListener("change", function () {
      var s = SERVICES[sel.value], box = $("#bk-picked");
      if (box) box.innerHTML = s ? "You're booking: <strong>" + esc(s.name) + "</strong> · " + esc(s.price) : "";
      var who = $("#bk-who");
      if (who) { if (sel.value === "first-child") who.value = "My child"; else if (sel.value === "gift") who.value = "A gift for someone"; else if (who.value === "My child" || who.value === "A gift for someone") who.value = "Myself"; }
    });
    sel.dispatchEvent(new Event("change"));
  }
  $$("[data-book]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("data-book");
      if (sel) { e.preventDefault(); pick(id); var t = $("#book"); if (t) t.scrollIntoView({ behavior: "smooth", block: "start" }); setTimeout(function () { var n = $("#bk-name"); if (n) n.focus({ preventScroll: true }); }, 600); }
    });
  });

  function val(f, n) { var el = f.elements[n]; if (!el) return ""; if (el.length && !el.tagName) { for (var i = 0; i < el.length; i++) if (el[i].checked) return el[i].value; return ""; } return (el.value || "").trim(); }

  function compose(form) {
    var kind = form.getAttribute("data-form"), r = ref(), lines = [];
    if (kind === "booking") {
      var s = SERVICES[val(form, "service")] || { name: val(form, "service"), price: "" };
      lines.push("Consultation request " + r, "", "Consultation: " + s.name + (s.price ? " (" + s.price + ")" : ""), "Where: " + (val(form, "mode") || "-"));
      if (val(form, "who")) lines.push("For: " + val(form, "who"));
      lines.push("Preferred days/times: " + (val(form, "when") || "Flexible"), "", "Name: " + val(form, "name"), "Email: " + val(form, "email"), "Phone: " + (val(form, "phone") || "-"));
      if (val(form, "note")) lines.push("", "Note: " + val(form, "note"));
      lastMsg = { subject: "Consultation request — " + s.name + " (" + r + ")", body: lines.join(NL), service: val(form, "service") };
    } else {
      lines.push("Message from the website " + r, "", "Name: " + val(form, "name"), "Email: " + val(form, "email"), "Phone: " + (val(form, "phone") || "-"), "Topic: " + (val(form, "topic") || "General"), "", val(form, "message"));
      lastMsg = { subject: "Website enquiry — " + (val(form, "topic") || "General") + " (" + r + ")", body: lines.join(NL), service: "" };
    }
    return lastMsg;
  }

  function showSend(msg, sentOk) {
    if (!sendDlg) return;
    $(".msg-preview", sendDlg).textContent = msg.body;
    var ok = $("[data-sent]", sendDlg), pending = $("[data-unsent]", sendDlg);
    if (ok) ok.hidden = !sentOk; if (pending) pending.hidden = !!sentOk;
    var em = $("[data-send=email]", sendDlg), wa = $("[data-send=whatsapp]", sendDlg), fm = $("[data-send=form]", sendDlg);
    if (em) { em.hidden = !EMAIL || sentOk; em.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(msg.subject) + "&body=" + encodeURIComponent(msg.body); }
    if (wa) { wa.hidden = !WHATSAPP || sentOk; wa.href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(msg.body); wa.target = "_blank"; wa.rel = "noopener"; }
    if (fm) { fm.hidden = !FORM_URL || !!SEND_URL || sentOk; if (FORM_URL) external(fm, FORM_URL); }
    var pay = $("[data-pay-now]", sendDlg), url = PAYMENT[msg.service];
    if (pay) { pay.hidden = !url; if (url) external(pay, url); }
    var bk = $("[data-show=booking]", sendDlg); if (bk) bk.hidden = !BOOKING_URL || msg.service === "";
    var bank = $("[data-bank-line]", sendDlg); if (bank) { bank.hidden = !BANK_DETAILS || !msg.service || msg.service === "discovery"; $("span", bank).textContent = BANK_DETAILS; }
    openDlg(sendDlg);
  }

  $$("form[data-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var bad = $$("[required]", form).filter(function (el) { return el.type === "checkbox" ? !el.checked : !el.value.trim(); });
      $$(".form-err", form).forEach(function (x) { x.remove(); });
      if (bad.length) {
        bad.forEach(function (el) { el.setAttribute("aria-invalid", "true"); });
        var p = document.createElement("p"); p.className = "form-err"; p.setAttribute("role", "alert");
        p.textContent = "Please fill in the highlighted fields."; form.querySelector("[type=submit]").insertAdjacentElement("beforebegin", p);
        bad[0].focus(); return;
      }
      var em = form.elements.email; if (em && em.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value)) { em.setAttribute("aria-invalid", "true"); em.focus(); say("Please check the email address"); return; }
      $$("[aria-invalid]", form).forEach(function (el) { el.removeAttribute("aria-invalid"); });
      var msg = compose(form);
      if (SEND_URL) {
        var btn = form.querySelector("[type=submit]"); btn.disabled = true; var old = btn.textContent; btn.textContent = "Sending…";
        var data = { _subject: msg.subject, message: msg.body, _template: "box", _captcha: "false" };
        if (form.elements.email) data.email = form.elements.email.value;
        fetch(SEND_URL, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) })
          .then(function (r) { if (!r.ok) throw 0; return r.json(); })
          .then(function () { showSend(msg, true); form.reset(); if (sel) sel.dispatchEvent(new Event("change")); })
          .catch(function () { showSend(msg, false); })
          .then(function () { btn.disabled = false; btn.textContent = old; });
      } else showSend(msg, false);
    });
    $$("input,select,textarea", form).forEach(function (el) { el.addEventListener("input", function () { el.removeAttribute("aria-invalid"); }); });
  });

  var copyBtn = sendDlg && $("[data-copy]", sendDlg);
  if (copyBtn) copyBtn.addEventListener("click", function () {
    var t = lastMsg.body;
    (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { say("Copied — paste it into an email or message"); }, function () {
      var ta = document.createElement("textarea"); ta.value = t; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); say("Copied"); } catch (e) {} ta.remove();
    });
  });

  /* contact page: ?about=... pre-fills the topic */
  var topic = $("#ct-topic"), about = new URLSearchParams(location.search).get("about");
  if (topic && about) { for (var i = 0; i < topic.options.length; i++) if (topic.options[i].value === about) topic.value = about; }

  /* Minimum date for preferred date fields */
  $$("input[type=date]").forEach(function (d) { var t = new Date(); t.setDate(t.getDate() + 1); d.min = t.toISOString().slice(0, 10); });
})();
