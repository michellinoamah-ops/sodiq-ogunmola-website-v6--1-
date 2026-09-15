/* ===================================================================
   App shell: view switching ("page breaks"), breadcrumb, nav overlay,
   and rendering for every view. Requires content.js and (on pages that
   talk to Firestore) firebase-config.js to be loaded first.
   =================================================================== */

const VIEW_LABELS = { home: "Home", about: "About", publications: "Publications", article: "Article", contact: "Contact" };
let navStack = [];
let currentPub = null;

function esc(str){
  return String(str || "").replace(/[&<>"']/g, s => ({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" }[s]));
}

/* ---------------- Navigation ---------------- */
function navigate(viewId, params){
  params = params || {};
  const last = navStack[navStack.length - 1];
  if(!last || last.id !== viewId || JSON.stringify(last.params) !== JSON.stringify(params)){
    navStack.push({ id: viewId, params });
  }
  render(viewId, params);
}

function goBack(){
  if(navStack.length < 2) return;
  navStack.pop();
  const target = navStack[navStack.length - 1];
  navStack.pop();
  navigate(target.id, target.params);
}

function updateCrumb(){
  const bar = document.getElementById("crumb-bar");
  if(navStack.length < 2){ bar.classList.add("hidden"); return; }
  bar.classList.remove("hidden");
  const prev = navStack[navStack.length - 2];
  const current = navStack[navStack.length - 1];
  document.getElementById("crumb-prev").textContent = VIEW_LABELS[prev.id] || prev.id;
  document.getElementById("crumb-current").textContent = VIEW_LABELS[current.id] || current.id;
}

function render(viewId, params){
  params = params || {};
  const root = document.getElementById("view-root");
  const renderers = {
    home: renderHome,
    about: renderAbout,
    publications: renderPublications,
    article: () => renderArticle(params.id),
    contact: renderContact
  };
  root.innerHTML = (renderers[viewId] || renderHome)();
  updateCrumb();
  updateActiveNavLinks(viewId);
  closeOverlay();
  window.scrollTo({ top: 0, behavior: "auto" });
  afterRender(viewId, params);
}

function updateActiveNavLinks(viewId){
  document.querySelectorAll("[data-nav-link]").forEach(a => {
    a.classList.toggle("is-current", a.dataset.navLink === viewId);
  });
}

function afterRender(viewId, params){
  if(viewId === "about") initSlideshow();
  if(viewId === "contact") wireContactForm();
  if(viewId === "article") wireArticle(params.id);
  if(viewId === "publications") loadCommentCountsOnList();
}

/* ---------------- Nav overlay + mobile menu ---------------- */
function openOverlay(){
  document.getElementById("nav-overlay").classList.add("open");
  document.querySelector(".menu-toggle").classList.add("is-open");
  document.body.style.overflow = "hidden";
}
function closeOverlay(){
  const ov = document.getElementById("nav-overlay");
  if(ov) ov.classList.remove("open");
  const t = document.querySelector(".menu-toggle");
  if(t) t.classList.remove("is-open");
  document.body.style.overflow = "";
}

/* ================= HOME ================= */
function renderHome(){
  return `
  <section class="hero hero-bg-wrap" style="min-height: calc(100vh - 260px); display:flex; align-items:center;">
    <div class="hero-bg" aria-hidden="true">
      <img src="assets/images/backgrounds/bg-home-1.jpg" alt="">
      <img src="assets/images/backgrounds/bg-home-2.jpg" alt="">
      <img src="assets/images/backgrounds/bg-home-3.jpg" alt="">
    </div>
    <div class="container" style="position:relative; z-index:1;">
      <span class="kicker">Financial Reporting &amp; Risk</span>
      <h1>Making financial data defensible, transparent, and hard to manipulate.</h1>
      <p class="hero-sub">I am ${esc(SITE.name)}, ${esc(SITE.suffix)}, a financial reporting and risk professional researching how audit technology, artificial intelligence, and public financial management reform close the gaps where fraud and fiscal waste hide.</p>
      <div class="hero-actions">
        <a class="btn btn-accent" data-nav="publications">View my research papers</a>
      </div>
      <div class="hero-meta">
        <div><strong>6+ yrs</strong> financial reporting and audit</div>
        <div><strong>CFE, CISA</strong> Fraud Examiner &amp; Info Systems Auditor</div>
        <div><strong>11</strong> published research articles</div>
      </div>
    </div>
  </section>
  `;
}

function pubTeaserHTML(p){
  return `
  <article class="pub-teaser" data-nav="article" data-id="${esc(p.id)}">
    <div class="yr">${esc(p.year)}</div>
    <div>
      <h3>${esc(p.title)}</h3>
      <span class="journal">${esc(p.journal)}</span>
      <p>${esc(p.summary)}</p>
    </div>
    <div class="arrow">&rarr;</div>
  </article>`;
}

/* ================= ABOUT ================= */
function renderAbout(){
  return `
  <section class="page-title container">
    <span class="kicker">About</span>
    <h1>A little about Sodiq.</h1>
  </section>

  <section class="section">
    <div class="container split">
      <div>
        <div class="slideshow" id="about-slideshow">
          <div class="slideshow-track">
            ${SLIDESHOW_IMAGES.map((s,i) => `
              <div class="slideshow-slide ${i===0?"active":""}" data-index="${i}">
                <img src="${esc(s.src)}" alt="${esc(s.caption)}">
                <div class="slideshow-caption">${esc(s.caption)}</div>
              </div>`).join("")}
            <button class="slideshow-nav prev" aria-label="Previous photo">&#8249;</button>
            <button class="slideshow-nav next" aria-label="Next photo">&#8250;</button>
          </div>
          <div class="slideshow-dots">
            ${SLIDESHOW_IMAGES.map((_,i) => `<button data-dot="${i}" class="${i===0?"active":""}" aria-label="Photo ${i+1}"></button>`).join("")}
          </div>
        </div>
      </div>
      <div>
        <p class="lede">Sodiq Ogunmola is a financial reporting and risk professional with more than six years of experience across financial reporting, internal audit, and risk management for multinational organizations. He holds a dual master's degree in Professional Accounting and Management Information Systems from Lamar University, in addition to a Master of Business Administration &mdash; three master's degrees in total.</p>
        <p>He is a Certified Fraud Examiner (CFE), a Certified Information Systems Auditor (CISA), and a chartered member of the Nigerian Institute of Management. His work has helped close over &#8358;30 billion in combined equity and debt financing, cut month end reporting time by 20% through automation, and strengthen internal controls across teams applying U.S. GAAP, IFRS, and SOX standards. Outside of his day to day work, he researches how audit technology, artificial intelligence, and public financial management reform can make financial systems harder to manipulate and easier to trust, work reflected in the eleven papers published on this site.</p>
      </div>
    </div>
  </section>
  `;
}

function initSlideshow(){
  const root = document.getElementById("about-slideshow");
  if(!root) return;
  const slides = root.querySelectorAll(".slideshow-slide");
  const dots = root.querySelectorAll(".slideshow-dots button");
  let idx = 0;
  let timer = null;

  function show(n){
    idx = (n + slides.length) % slides.length;
    slides.forEach((s,i) => s.classList.toggle("active", i === idx));
    dots.forEach((d,i) => d.classList.toggle("active", i === idx));
  }
  function restart(){
    clearInterval(timer);
    timer = setInterval(() => show(idx + 1), 5500);
  }
  root.querySelector(".slideshow-nav.prev").addEventListener("click", () => { show(idx - 1); restart(); });
  root.querySelector(".slideshow-nav.next").addEventListener("click", () => { show(idx + 1); restart(); });
  dots.forEach((d,i) => d.addEventListener("click", () => { show(i); restart(); }));
  restart();
}

/* ================= PUBLICATIONS ================= */
function renderPublications(){
  const list = PUBLICATIONS.slice().sort((a,b)=>a.order-b.order);
  return `
  <section class="page-title pub-title-bg-wrap">
    <div class="pub-title-bg" style="background-image:url('assets/images/backgrounds/bg-publications.jpg');" aria-hidden="true"></div>
    <div class="container" style="position:relative; z-index:1;">
      <span class="kicker">Publications</span>
      <h1>Research papers &amp; publications.</h1>
      <p class="lede">Eleven peer-reviewed and industry-reviewed articles spanning machine learning fraud detection, AI-driven financial reporting, agile public financial management, corporate governance, cybersecurity, and environmental sustainability.</p>
    </div>
  </section>
  <section class="section tight">
    <div class="container">
      <div class="pub-card-grid" id="pub-card-grid">
        ${list.map(pubCardHTML).join("")}
      </div>
    </div>
  </section>
  `;
}

function pubCardHTML(p){
  return `
  <article class="pub-card" data-nav="article" data-id="${esc(p.id)}">
    <div class="meta-row"><span>${esc(p.year)}</span><span>${esc(p.type)}</span><span class="comment-count" data-comment-count="${esc(p.id)}">&hellip;</span></div>
    <h3>${esc(p.title)}</h3>
    <p>${esc(p.summary)}</p>
    <div class="byline">By ${esc(p.authors)}</div>
  </article>`;
}

/* ================= ARTICLE ================= */
function renderArticle(pubId){
  const p = PUBLICATIONS.find(x => x.id === pubId) || PUBLICATIONS[0];
  currentPub = p;
  return `
  <section class="article-head container narrow">
    <span class="kicker">Research Paper</span>
    <h1>${esc(p.title)}</h1>
    ${p.subtitle ? `<p class="lede">${esc(p.subtitle)}</p>` : ""}
    <p class="article-meta">${esc(p.year)} &middot; ${esc(p.authors)}<br>${esc(p.journal)}</p>
    <div class="article-tags">${p.tags.map(t => `<span class="tag">${esc(t)}</span>`).join("")}</div>
  </section>

  <section class="container narrow">
    <div class="abstract-block">
      <span class="kicker">Abstract</span>
      <p>${esc(p.abstract)}</p>
    </div>
    <div class="article-actions">
      ${p.file ? `<a class="btn btn-accent" href="${esc(p.file)}" target="_blank" rel="noopener">Read the full PDF</a>` : ""}
      ${p.link ? `<a class="btn btn-outline" href="${esc(p.link)}" target="_blank" rel="noopener">View journal listing</a>` : ""}
      <a class="btn btn-ghost" data-nav="publications">&larr; All publications</a>
    </div>
  </section>

  <section class="section container narrow">
    <div class="comments-head"><span class="count" id="comment-count-num">0</span><h2 style="margin:0;">thoughts on this</h2></div>
    <div id="comment-list"><p class="comment-empty">Loading comments...</p></div>

    <form id="comment-form" class="comment-form" novalidate>
      <p class="notice">Your email address will not be published. Comments are reviewed before appearing publicly. <strong>Required fields are marked *</strong></p>
      <div class="field"><label for="c-message">Comment</label><textarea id="c-message" name="message" placeholder="Type here..." required></textarea></div>
      <div class="form-row">
        <div class="field"><label for="c-name">Name <span class="req">*</span></label><input type="text" id="c-name" name="name" required></div>
        <div class="field"><label for="c-email">Email <span class="req">*</span></label><input type="email" id="c-email" name="email" required></div>
      </div>
      <div class="field"><label for="c-website">Website</label><input type="text" id="c-website" name="website"></div>
      <button type="submit" class="btn btn-accent">Post Comment &raquo;</button>
      <div id="comment-status" class="form-status" role="status"></div>
    </form>
  </section>
  `;
}

function wireArticle(pubId){
  loadComments(pubId);
  const form = document.getElementById("comment-form");
  if(!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const status = document.getElementById("comment-status");
    const btn = form.querySelector("button[type=submit]");
    const data = {
      articleId: pubId,
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      website: form.website.value.trim() || null,
      message: form.message.value.trim(),
      status: "pending",
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    if(!data.name || !data.email || !data.message){
      status.textContent = "Please fill in the required fields.";
      status.className = "form-status show err";
      return;
    }
    btn.disabled = true;
    btn.textContent = "Posting...";
    try{
      await db.collection("comments").add(data);
      form.reset();
      status.textContent = "Thank you. Your comment has been submitted and will appear once reviewed.";
      status.className = "form-status show ok";
    }catch(err){
      status.textContent = "Something went wrong submitting your comment. Please try again shortly.";
      status.className = "form-status show err";
    }finally{
      btn.disabled = false;
      btn.textContent = "Post Comment \u00BB";
    }
  });
}

async function loadComments(pubId){
  const listEl = document.getElementById("comment-list");
  const countEl = document.getElementById("comment-count-num");
  try{
    /* Filter/sort client-side rather than chaining two where() clauses with
       an orderBy() on a third field — that combination needs a Firestore
       composite index to be created manually in the console, and without
       it the query silently fails. A single where() on articleId only
       needs Firestore's automatic single-field index. */
    const snap = await db.collection("comments").where("articleId", "==", pubId).get();
    const approved = snap.docs
      .filter(doc => doc.data().status === "approved")
      .sort((a, b) => {
        const ta = a.data().createdAt && a.data().createdAt.toMillis ? a.data().createdAt.toMillis() : 0;
        const tb = b.data().createdAt && b.data().createdAt.toMillis ? b.data().createdAt.toMillis() : 0;
        return ta - tb;
      });
    countEl.textContent = approved.length;
    if(approved.length === 0){
      listEl.innerHTML = `<p class="comment-empty">No comments yet. Be the first to share your thoughts.</p>`;
      return;
    }
    listEl.innerHTML = approved.map(doc => {
      const c = doc.data();
      const initials = (c.name || "?").trim().split(/\s+/).map(w => w[0]).slice(0,2).join("").toUpperCase();
      const when = c.createdAt && c.createdAt.toDate ? c.createdAt.toDate().toLocaleDateString(undefined, { year:"numeric", month:"long", day:"numeric" }) : "";
      return `
      <div class="comment-item">
        <div class="comment-author"><span class="avatar">${esc(initials)}</span> ${esc(c.name)}</div>
        <div class="comment-text">${esc(c.message)}</div>
        <div class="comment-date">${esc(when)}</div>
      </div>`;
    }).join("");
  }catch(err){
    listEl.innerHTML = `<p class="comment-empty">Comments are temporarily unavailable.</p>`;
    countEl.textContent = "0";
  }
}

async function loadCommentCountsOnList(){
  const nodes = document.querySelectorAll("[data-comment-count]");
  for(const node of nodes){
    const id = node.dataset.commentCount;
    try{
      const snap = await db.collection("comments").where("articleId","==",id).get();
      const count = snap.docs.filter(doc => doc.data().status === "approved").length;
      node.textContent = count + (count === 1 ? " Comment" : " Comments");
    }catch(err){
      node.textContent = "";
    }
  }
}

/* ================= CONTACT ================= */
function renderContact(){
  return `
  <section class="page-title container">
    <span class="kicker">Contact</span>
    <h1>Let's talk finance, audit, or research.</h1>
    <p class="lede">Whether it is a collaboration on public financial management research, a speaking invitation, or a finance and audit consulting question, send a message and I will get back to you.</p>
  </section>
  <section class="section tight">
    <div class="container split">
      <div>
        <form id="contact-form" novalidate>
          <div class="form-row">
            <div class="field"><label for="name">Name <span class="req">*</span></label><input type="text" id="name" name="name" required></div>
            <div class="field"><label for="email">Email <span class="req">*</span></label><input type="email" id="email" name="email" required></div>
          </div>
          <div class="field"><label for="message">Message <span class="req">*</span></label><textarea id="message" name="message" required placeholder="Tell me a bit about what you would like to discuss."></textarea></div>
          <button type="submit" class="btn btn-accent btn-block">Send Message</button>
          <div id="form-status" class="form-status" role="status"></div>
        </form>
      </div>
      <div>
        <div class="contact-info-list">
          <div class="contact-info-row"><div class="label">Email</div><div class="value"><a href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a><a href="mailto:${esc(SITE.email2)}">${esc(SITE.email2)}</a></div></div>
          <div class="contact-info-row"><div class="label">Phone</div><div class="value"><a href="tel:${esc(SITE.phone.replace(/[^+\d]/g,''))}">${esc(SITE.phone)}</a></div></div>
          <div class="contact-info-row"><div class="label">LinkedIn</div><div class="value"><a href="${esc(SITE.linkedin)}" target="_blank" rel="noopener">linkedin.com/in/sodiq-ogunmola-olaleye</a></div></div>
          <div class="contact-info-row"><div class="label">Based in</div><div class="value"><span>${esc(SITE.location)}</span></div></div>
        </div>
      </div>
    </div>
  </section>
  `;
}

function wireContactForm(){
  const form = document.getElementById("contact-form");
  if(!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const status = document.getElementById("form-status");
    const btn = form.querySelector("button[type=submit]");
    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim(),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      read: false
    };
    if(!data.name || !data.email || !data.message){
      status.textContent = "Please fill in your name, email and message.";
      status.className = "form-status show err";
      return;
    }
    btn.disabled = true;
    btn.textContent = "Sending...";
    try{
      await db.collection("messages").add(data);
      form.reset();
      status.textContent = "Message sent. Thank you. I usually reply within 2 business days.";
      status.className = "form-status show ok";
    }catch(err){
      status.textContent = "Something went wrong. Please email " + SITE.email + " directly.";
      status.className = "form-status show err";
    }finally{
      btn.disabled = false;
      btn.textContent = "Send Message";
    }
  });
}

/* ================= App boot ================= */
function bootApp(){
  document.getElementById("year").textContent = new Date().getFullYear();

  document.body.addEventListener("click", (e) => {
    const el = e.target.closest("[data-nav]");
    if(!el) return;
    e.preventDefault();
    navigate(el.dataset.nav, el.dataset.id ? { id: el.dataset.id } : {});
  });

  document.querySelector(".menu-toggle").addEventListener("click", () => {
    const ov = document.getElementById("nav-overlay");
    ov.classList.contains("open") ? closeOverlay() : openOverlay();
  });
  document.getElementById("nav-overlay-close").addEventListener("click", closeOverlay);
  document.getElementById("crumb-back").addEventListener("click", goBack);

  initSecretAdminGate();

  render("home");
  navStack.push({ id: "home", params: {} });
}

/* Hidden entry point to the admin panel: tap the footer copyright line
   five times within three seconds. There is no visible "Admin" link
   anywhere on the public site. */
function initSecretAdminGate(){
  const gate = document.getElementById("secret-gate");
  if(!gate) return;
  const NEEDED = 5;
  const WINDOW_MS = 3000;
  let count = 0;
  let timer = null;
  gate.addEventListener("click", () => {
    count++;
    clearTimeout(timer);
    timer = setTimeout(() => { count = 0; }, WINDOW_MS);
    if(count >= NEEDED){
      count = 0;
      clearTimeout(timer);
      window.location.href = "admin/index.html";
    }
  });
}

document.addEventListener("DOMContentLoaded", bootApp);
