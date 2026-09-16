/* Admin panel logic. Requires firebase-config.js (and, on the publications
   panel, content.js for the starter-import list) to be loaded first. */

function esc(str){
  return String(str || "").replace(/[&<>"']/g, s => ({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" }[s]));
}

/* ---------- Login page ---------- */
function initLoginPage(){
  const form = document.getElementById("login-form");
  if(!form) return;
  const status = document.getElementById("login-status");

  auth.onAuthStateChanged(user => {
    if(user) window.location.href = "dashboard.html";
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector("button[type=submit]");
    status.className = "form-status";
    status.textContent = "";
    btn.disabled = true;
    btn.textContent = "Signing in...";
    try{
      await auth.signInWithEmailAndPassword(form.email.value.trim(), form.password.value);
      window.location.href = "dashboard.html";
    }catch(err){
      status.textContent = friendlyAuthError(err);
      status.className = "form-status show err";
    }finally{
      btn.disabled = false;
      btn.textContent = "Sign in";
    }
  });
}

function friendlyAuthError(err){
  const map = {
    "auth/invalid-email": "That email address doesn't look right.",
    "auth/user-not-found": "No admin account matches that email.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/too-many-requests": "Too many attempts. Please wait a moment and try again."
  };
  return map[err.code] || "Couldn't sign in. Please try again.";
}

/* ---------- Dashboard ---------- */
function initDashboard(){
  const shell = document.getElementById("dashboard-shell");
  if(!shell) return;

  document.getElementById("logout-btn").addEventListener("click", async () => {
    try{ await auth.signOut(); }catch(e){}
    window.location.href = "index.html";
  });

  document.querySelectorAll(".admin-nav a[data-section]").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelectorAll(".admin-nav a").forEach(a => a.classList.remove("active"));
      link.classList.add("active");
      document.querySelectorAll(".admin-section").forEach(s => s.classList.add("hidden"));
      document.getElementById(link.dataset.section).classList.remove("hidden");
    });
  });

  const modal = document.getElementById("pub-modal");
  const pubForm = document.getElementById("pub-form");
  const openModal = (pub, id) => {
    pubForm.reset();
    pubForm.dataset.editId = id || "";
    document.getElementById("pub-modal-title").textContent = id ? "Edit publication" : "Add publication";
    if(pub){
      pubForm.title.value = pub.title || "";
      pubForm.journal.value = pub.journal || "";
      pubForm.year.value = pub.year || "";
      pubForm.summary.value = pub.summary || "";
      pubForm.abstract.value = pub.abstract || "";
      pubForm.tags.value = (pub.tags || []).join(", ");
      pubForm.file.value = pub.file || "";
      pubForm.link.value = pub.link || "";
      pubForm.authors.value = pub.authors || "";
      pubForm.image.value = pub.image || "";
      pubForm.order.value = pub.order ?? "";
    }
    modal.classList.add("open");
  };
  document.getElementById("add-pub-btn").addEventListener("click", () => openModal());
  document.getElementById("seed-pub-btn").addEventListener("click", seedPublications);
  modal.querySelectorAll("[data-close-modal]").forEach(el => el.addEventListener("click", () => modal.classList.remove("open")));

  pubForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      title: pubForm.title.value.trim(),
      journal: pubForm.journal.value.trim(),
      year: pubForm.year.value.trim(),
      summary: pubForm.summary.value.trim(),
      abstract: pubForm.abstract.value.trim(),
      tags: pubForm.tags.value.split(",").map(t => t.trim()).filter(Boolean),
      file: pubForm.file.value.trim() || null,
      link: pubForm.link.value.trim() || null,
      authors: pubForm.authors.value.trim() || "Sodiq Ogunmola",
      image: pubForm.image.value.trim() || "assets/images/headshot.jpg",
      order: pubForm.order.value ? Number(pubForm.order.value) : 99,
      type: "Research Paper",
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    const editId = pubForm.dataset.editId;
    const btn = pubForm.querySelector("button[type=submit]");
    btn.disabled = true;
    try{
      if(editId){
        await db.collection("publications").doc(editId).update(data);
      }else{
        data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
        await db.collection("publications").add(data);
      }
      modal.classList.remove("open");
      loadAdminPublications();
    }catch(err){
      alert("Couldn't save publication: " + err.message);
    }finally{
      btn.disabled = false;
    }
  });

  window.__openPubModal = openModal;

  try{
    auth.onAuthStateChanged(user => {
      if(!user){ window.location.href = "index.html"; return; }
      document.getElementById("admin-email").textContent = user.email;
      loadMessages();
      loadReviewQueue();
      loadAdminPublications();
    });
  }catch(err){
    console.error("Auth unavailable:", err);
  }
}

async function seedPublications(){
  if(!confirm("Import the starter publication list into the database? You can edit or delete each entry afterward.")) return;
  const btn = document.getElementById("seed-pub-btn");
  btn.disabled = true;
  btn.textContent = "Importing...";
  try{
    const batch = db.batch();
    PUBLICATIONS.forEach(pub => {
      const ref = db.collection("publications").doc(pub.id);
      batch.set(ref, { ...pub, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
    });
    await batch.commit();
    loadAdminPublications();
  }catch(err){
    alert("Import failed: " + err.message);
  }finally{
    btn.disabled = false;
    btn.textContent = "Import starter list";
  }
}

function fmtDate(ts){
  if(!ts || !ts.toDate) return "";
  const d = ts.toDate();
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) +
    " at " + d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

/* ---------- Messages ---------- */
async function loadMessages(){
  const list = document.getElementById("messages-list");
  const kpiTotal = document.getElementById("kpi-total-messages");
  const kpiUnread = document.getElementById("kpi-unread-messages");
  try{
    const snap = await db.collection("messages").orderBy("createdAt", "desc").get();
    if(snap.empty){
      list.innerHTML = `<div class="empty-state">No messages yet. Enquiries submitted through the contact form will appear here.</div>`;
      kpiTotal.textContent = "0"; kpiUnread.textContent = "0";
      return;
    }
    let unread = 0;
    list.innerHTML = snap.docs.map(doc => {
      const m = doc.data();
      if(!m.read) unread++;
      return `
      <div class="msg-row ${m.read ? "read" : "unread"}" data-id="${doc.id}">
        <div class="msg-dot"></div>
        <div>
          <div class="msg-meta"><b>${esc(m.name)}</b><span class="muted">${esc(m.email)}</span><span class="when">${fmtDate(m.createdAt)}</span></div>
          <div class="msg-body">${esc(m.message)}</div>
        </div>
        <div class="msg-actions">
          ${m.read ? "" : `<button class="btn btn-outline btn-sm" data-action="read">Mark read</button>`}
          <a class="btn btn-outline btn-sm" href="mailto:${esc(m.email)}">Reply</a>
          <button class="btn btn-danger btn-sm" data-action="delete">Delete</button>
        </div>
      </div>`;
    }).join("");
    kpiTotal.textContent = snap.size;
    kpiUnread.textContent = unread;
    document.getElementById("nav-badge-messages").textContent = unread || "";
    document.getElementById("nav-badge-messages").classList.toggle("hidden", !unread);

    list.querySelectorAll("[data-action=read]").forEach(b => b.addEventListener("click", async (e) => {
      const row = e.target.closest(".msg-row");
      await db.collection("messages").doc(row.dataset.id).update({ read: true });
      loadMessages();
    }));
    list.querySelectorAll("[data-action=delete]").forEach(b => b.addEventListener("click", async (e) => {
      if(!confirm("Delete this message permanently?")) return;
      const row = e.target.closest(".msg-row");
      await db.collection("messages").doc(row.dataset.id).delete();
      loadMessages();
    }));
  }catch(err){
    list.innerHTML = `<div class="empty-state">Couldn't load messages: ${esc(err.message)}</div>`;
  }
}

/* ---------- Editorial review desk (comment moderation) ---------- */
async function loadReviewQueue(){
  const pendingList = document.getElementById("pending-comments-list");
  const approvedList = document.getElementById("approved-comments-list");
  const kpiPending = document.getElementById("kpi-pending-comments");
  const navBadge = document.getElementById("nav-badge-comments");
  const summaryEl = document.getElementById("review-summary");
  try{
    /* Single query, ordered by createdAt, split client-side. This avoids
       needing a Firestore composite index for status+createdAt (which
       Firestore otherwise demands for a where()+orderBy() on two
       different fields), and it also copes gracefully with comments
       that don't have a createdAt yet (e.g. serverTimestamp still
       resolving) by falling back to document order. */
    const snap = await db.collection("comments").orderBy("createdAt","desc").get();
    const all = snap.docs;
    const pendingDocs = all.filter(doc => (doc.data().status || "pending") === "pending");
    const approvedDocs = all.filter(doc => doc.data().status === "approved").slice(0, 30);

    kpiPending.textContent = pendingDocs.length;
    navBadge.textContent = pendingDocs.length || "";
    navBadge.classList.toggle("hidden", !pendingDocs.length);
    summaryEl.textContent = `${pendingDocs.length} pending, ${approvedDocs.length} approved`;

    pendingList.innerHTML = pendingDocs.length === 0
      ? `<div class="empty-state">No comments waiting for review.</div>`
      : pendingDocs.map(doc => reviewCardHTML(doc, true)).join("");

    approvedList.innerHTML = approvedDocs.length === 0
      ? `<div class="empty-state">No approved comments yet.</div>`
      : approvedDocs.map(doc => reviewCardHTML(doc, false)).join("");

    wireReviewButtons(pendingList);
    wireReviewButtons(approvedList);
  }catch(err){
    pendingList.innerHTML = `<div class="empty-state">Couldn't load comments: ${esc(err.message)}</div>`;
  }
}

/* Convert a Firestore Timestamp (or missing value) into the string a
   <input type="datetime-local"> expects, in the browser's local time. */
function toDatetimeLocalValue(ts){
  const d = (ts && ts.toDate) ? ts.toDate() : new Date();
  const pad = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function articleTitle(articleId){
  const p = (typeof PUBLICATIONS !== "undefined" ? PUBLICATIONS : []).find(x => x.id === articleId);
  return p ? p.title : articleId;
}

/* The publication year of the paper a comment was left on, so the review
   desk shows which paper AND when it was published. */
function articleYear(articleId){
  const p = (typeof PUBLICATIONS !== "undefined" ? PUBLICATIONS : []).find(x => x.id === articleId);
  return p && p.year ? p.year : "";
}

function reviewCardHTML(doc, pending){
  const c = doc.data();
  return `
  <div class="review-card" data-id="${doc.id}">
    <div class="who"><b>${esc(c.name)}</b> &middot; ${esc(c.email)}</div>
    <span class="on-article">On: ${esc(articleTitle(c.articleId))}${articleYear(c.articleId) ? ` <span class="pub-year-badge">${esc(articleYear(c.articleId))}</span>` : ""}</span>
    <div class="body-text">${esc(c.message)}</div>
    <div class="row-actions">
      ${pending ? `<button class="btn btn-accent btn-sm" data-action="approve">Approve</button><button class="btn btn-danger btn-sm" data-action="reject">Reject</button>`
                : `<button class="btn btn-outline btn-sm" data-action="unapprove">Unpublish</button>`}
      <span class="stamp">${fmtDate(c.createdAt)}</span>
    </div>
    <div class="row-actions date-edit">
      <label style="font-size:.85em;color:inherit;">Posted date &amp; time:
        <input type="datetime-local" class="date-input" value="${toDatetimeLocalValue(c.createdAt)}">
      </label>
      <button class="btn btn-outline btn-sm" data-action="save-date">Save date</button>
    </div>
  </div>`;
}

function wireReviewButtons(container){
  container.querySelectorAll("[data-action=approve]").forEach(b => b.addEventListener("click", async (e) => {
    const id = e.target.closest(".review-card").dataset.id;
    await db.collection("comments").doc(id).update({ status: "approved" });
    loadReviewQueue();
  }));
  container.querySelectorAll("[data-action=reject]").forEach(b => b.addEventListener("click", async (e) => {
    const id = e.target.closest(".review-card").dataset.id;
    if(!confirm("Reject and delete this comment?")) return;
    await db.collection("comments").doc(id).delete();
    loadReviewQueue();
  }));
  container.querySelectorAll("[data-action=unapprove]").forEach(b => b.addEventListener("click", async (e) => {
    const id = e.target.closest(".review-card").dataset.id;
    await db.collection("comments").doc(id).update({ status: "pending" });
    loadReviewQueue();
  }));
  container.querySelectorAll("[data-action=save-date]").forEach(b => b.addEventListener("click", async (e) => {
    const card = e.target.closest(".review-card");
    const id = card.dataset.id;
    const input = card.querySelector(".date-input");
    if(!input.value){ return; }
    // datetime-local gives local time with no offset; the Date constructor
    // interprets that string as local time too, so this round-trips correctly.
    const chosen = new Date(input.value);
    if(isNaN(chosen.getTime())){
      alert("That date/time doesn't look valid.");
      return;
    }
    b.disabled = true;
    b.textContent = "Saving...";
    try{
      await db.collection("comments").doc(id).update({
        createdAt: firebase.firestore.Timestamp.fromDate(chosen)
      });
      loadReviewQueue();
    }catch(err){
      alert("Couldn't save the date: " + err.message);
      b.disabled = false;
      b.textContent = "Save date";
    }
  }));
}

/* ---------- Publications ---------- */
async function loadAdminPublications(){
  const list = document.getElementById("admin-pub-list");
  const kpiPubs = document.getElementById("kpi-total-pubs");
  try{
    const snap = await db.collection("publications").orderBy("order", "asc").get();
    kpiPubs.textContent = snap.size;
    if(snap.empty){
      list.innerHTML = `<div class="empty-state">No publications in the database yet. The public site is currently showing the built-in starter list.<br><br>Click "Import starter list" to bring those into the database so you can edit them, or "Add publication" to start fresh.</div>`;
      return;
    }
    list.innerHTML = snap.docs.map(doc => {
      const p = doc.data();
      return `
      <div class="pub-row">
        <div>
          <h3>${esc(p.title)} <span class="pub-year-badge">${esc(p.year)}</span></h3>
          <div class="meta">${esc(p.journal)}${p.order != null ? " &middot; order " + esc(p.order) : ""}</div>
        </div>
        <div class="actions">
          <button class="btn btn-outline btn-sm" data-action="edit">Edit</button>
          <button class="btn btn-danger btn-sm" data-action="delete">Delete</button>
        </div>
      </div>`;
    }).join("");
    const docs = snap.docs;
    list.querySelectorAll(".pub-row").forEach((row, i) => {
      const doc = docs[i];
      row.querySelector("[data-action=edit]").addEventListener("click", () => window.__openPubModal(doc.data(), doc.id));
      row.querySelector("[data-action=delete]").addEventListener("click", async () => {
        if(!confirm("Delete this publication from the live site?")) return;
        await db.collection("publications").doc(doc.id).delete();
        loadAdminPublications();
      });
    });
  }catch(err){
    list.innerHTML = `<div class="empty-state">Couldn't load publications: ${esc(err.message)}</div>`;
  }
}