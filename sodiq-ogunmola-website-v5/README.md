# Sodiq Ogunmola. Research Repository

A single-page, dark-themed research and professional portfolio site with
a working contact form, moderated comments on each publication, and a
private admin panel to manage all three.

## What's included

```
index.html              The whole public site (Home, About, Publications,
                          Article, Contact are views inside one page; the
                          app switches between them, it does not reload).
admin/index.html         Admin sign in
admin/dashboard.html     Admin dashboard: messages, comment moderation,
                          publications editor
assets/css/              Stylesheets
assets/js/
  content.js              All static site copy: bio, timeline, publications
  app.js                  View router, rendering, forms, comments
  firebase-config.js      Firebase project configuration
  admin.js                Admin dashboard logic
assets/images/            Photos (used on Home, About slideshow, and as
                          publication card thumbnails)
assets/docs/               Publication PDFs and CV
assets/icons/               Logo (SVG) and generated favicons
firestore.rules             Firestore security rules
firebase.json / .firebaserc  Firebase Hosting config
```

No build step. Open `index.html` directly, or deploy the folder as-is to
Firebase Hosting, Netlify, Vercel, or any static host.

## One-time setup (Firebase Console)

The Firebase project is already wired into `assets/js/firebase-config.js`.
Three things still need doing in the
[Firebase Console](https://console.firebase.google.com/project/ogunmola-website):

1. **Create the database.** Firestore Database -> Create database -> start
   in production mode.
2. **Publish the security rules.** Firestore Database -> Rules -> paste the
   contents of `firestore.rules` -> Publish. This allows visitors to send a
   contact message or submit a comment (which starts hidden, as "pending"),
   while only a signed-in admin can read messages, moderate comments, or
   edit publications.
3. **Turn on email/password sign-in and create the admin account.**
   Authentication -> Sign-in method -> enable "Email/Password" -> Users tab
   -> Add user -> enter the email and password used to log into `/admin`.

No sign-up form exists anywhere on the public site, so this is the only way
an admin account gets created.

## Using the admin panel

Go to `/admin/` and sign in.

- **Messages**: every contact form submission, newest first. Mark as read,
  reply by email, or delete.
- **Editorial Review**: every comment submitted on a publication starts
  here as pending. Approve to publish it immediately on the article page,
  or reject to delete it. Approved comments can also be unpublished later
  if needed.
- **Publications**: the public Publications page shows a built in starter
  list of ten papers until something is added here. Click **Import
  starter list** once to load those ten into the database so they can be
  edited or removed, or click **Add publication** to start from scratch.
  Whatever exists in the database is what visitors see.

## Deploying

**Firebase Hosting** (matches the project already configured):

```
npm install -g firebase-tools
firebase login
firebase deploy
```

**Any other static host**: upload the folder as-is, nothing needs to be
built.

## Notes

- The Firebase web config in `firebase-config.js` is safe to keep public,
  it identifies the project only. Actual access is controlled by the
  Firestore rules and Authentication set up above.
- Comment moderation is enforced at the database level: a comment can only
  ever be created with status "pending", and only a signed-in admin can
  change that status or delete a comment. There is no way to bypass review
  from the public site.
