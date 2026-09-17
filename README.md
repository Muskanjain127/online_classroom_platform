# MastersGang — Online Classroom

A full-stack classroom platform where every enrollment is confirmed by a one-time
code, not an open link. Rebuilt with a Tailwind CSS frontend and extra features
on top of the original project.

## Stack

- **Frontend:** React 18, React Router, Tailwind CSS, Lucide icons, React Toastify
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth, Nodemailer (OTP email)

## What's new in this version

- **Tailwind rebuild** — every page restyled with Tailwind utility classes (no heavy
  custom CSS), on a consistent dark violet/gold design system.
- **Public marketing homepage** at `/` explaining how the OTP-based enrollment works,
  separate from the logged-in dashboard.
- **Assignments vs. announcements** — posts now carry a `type` and an optional due
  date, shown as a badge on each post.
- **Delete a post** — classroom owners can remove a post they created.
- **Delete a classroom** — owners can permanently delete a classroom (and its posts).
- **Leave a classroom** — students can remove themselves from a classroom's roll.
- **Classroom roster** — owners can view the list of enrolled student emails.
- **Dashboard stats** — classrooms created/joined, students taught, and posts shared,
  shown on the profile page.
- **Edit display name** — update your name from the profile page.
- **Duplicate-join guard** — the backend now blocks a join request from someone
  already enrolled.
- **Owner-only posting** — `addpost` now checks that the requester actually owns the
  classroom (this was a `TODO` in the original code).
- **404 page** for unmatched routes.
- **`.env.example`** files instead of committing real secrets (see note below).

## Project structure

```
mastersgang/
├── backend/         Express API (auth, classrooms, posts, OTP join flow)
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   └── index.js
└── frontend/         React app styled with Tailwind CSS
    ├── src/
    │   ├── pages/         Landing, Login, Signup, Profile, ClassesDetails, NotFound
    │   ├── components/    Navbar, SearchPopup, Modal
    │   └── context/       AuthContext
    └── tailwind.config.js
```

## Running it locally

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in your own MongoDB URI, JWT secrets, and Gmail app password
npm start
```

The API listens on the `PORT` set in `.env` (default `5000`).

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

The app runs on `http://localhost:3000` and talks to the API at the URL set in
`frontend/.env` (`REACT_APP_API_BASE_URL`).

## A security note

The original public repo had real MongoDB, JWT, and Gmail app-password credentials
committed to `.env`. This version replaces that with `.env.example` placeholders —
worth rotating those old credentials (new Mongo password, new Gmail app password,
new JWT secrets) since they were exposed in a public repository, and adding `.env`
to `.gitignore` going forward (already done here).

## How the OTP join flow works

1. A teacher creates a classroom (name + description).
2. A student searches for it by name and sends a join request.
3. The backend emails a 6-digit code to the **teacher's** address and stores a
   pending `ClassroomJoin` record.
4. The student enters that code (given to them by the teacher) to confirm — only
   then is their email added to the classroom's roll and posts become visible.

This two-party confirmation is the core idea worth highlighting in an interview:
enrollment isn't self-service, it's witnessed.
