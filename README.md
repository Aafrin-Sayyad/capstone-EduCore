# EduCore — Learning Management System

A full-featured LMS web application built as part of the 5-week Capstone Project (Sprint 13–17).  
Inspired by platforms like Udemy and Coursera, EduCore allows students to browse, enroll, and track progress through courses, while instructors can create and manage their course catalog.

---

## 🎯 Designated Track

**Frontend Track** — Next.js 14 + Zustand (mock data via `db.json` + LocalStorage persistence)

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State Management | Zustand (with `persist` middleware) |
| Data Layer | Mock JSON (`db.json`) + LocalStorage |
| Deployment | Vercel |

---

## ✅ Core Features

### P0 — Must Have (Sprint 14 MVP)
- [x] Authentication screen (Login / Register UI with role selection)
- [x] Student Dashboard with enrolled courses + stats
- [x] Course Catalog with search and category filter
- [x] Course Detail Page with lesson list and enroll flow
- [x] Lesson progress tracking (mark complete + progress bar)
- [x] Instructor Portal with course management table
- [x] User Profile page with enrolled courses overview
- [x] Zustand global state with LocalStorage persistence
- [x] Fully responsive (mobile + desktop)

### P1 — Should Have (Sprint 15)
- [ ] Video player integration (YouTube embed or HLS)
- [ ] Course ratings and reviews UI
- [ ] Quiz module with score tracking
- [ ] Search with debounce

### P2 — Nice to Have (Sprint 16)
- [ ] AI-powered course recommendations
- [ ] Certificate of completion (PDF generation)
- [ ] Instructor analytics charts (Chart.js)
- [ ] Dark mode toggle

---

## 🗂 Project Structure

```
educore-lms/
├── src/
│   ├── app/
│   │   ├── auth/          # Login & Register page
│   │   ├── dashboard/     # Student dashboard
│   │   ├── courses/       # Course catalog
│   │   │   └── [id]/      # Course detail + lesson player
│   │   ├── instructor/    # Instructor portal
│   │   └── profile/       # User profile
│   ├── components/
│   │   ├── layout/        # Navbar
│   │   └── course/        # CourseCard
│   ├── data/
│   │   └── db.json        # Mock database
│   └── store/
│       └── useStore.ts    # Zustand global store
├── public/
├── tailwind.config.ts
├── next.config.mjs
└── package.json
```

---

## 🧠 State Tree (Zustand Store)

```
AppState
├── Auth
│   ├── currentUser: User | null
│   ├── isLoggedIn: boolean
│   ├── login(email, password) → { success, message }
│   └── logout()
│
├── Courses
│   ├── courses: Course[]          ← loaded from db.json
│   ├── enrolledCourseIds: string[]
│   └── enrollCourse(courseId)
│
├── Progress
│   ├── progress: { [courseId]: { completedLessons, lastWatched, percentage } }
│   └── markLessonComplete(courseId, lessonId)
│
└── UI
    ├── selectedCategory: string
    ├── setSelectedCategory(cat)
    ├── searchQuery: string
    └── setSearchQuery(q)
```

> Persisted to `localStorage` via Zustand `persist` middleware (auth + enrollment state only).

---

## 🌐 Mock API Endpoints (Frontend simulation via db.json)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | Validate credentials from `db.json` users array |
| `/api/courses` | GET | Return all courses (optionally filter by category) |
| `/api/courses/:id` | GET | Return single course with lessons |
| `/api/courses/:id/enroll` | POST | Add courseId to user's enrolled list |
| `/api/progress/:userId` | GET | Fetch lesson completion data |
| `/api/progress/update` | PATCH | Mark lesson as complete |
| `/api/instructor/courses` | GET | Fetch courses by instructorId |
| `/api/instructor/courses` | POST | Submit new course for review |

> These are simulated in the Zustand store — no actual HTTP calls in Sprint 13/14.

---

## 🎨 UI/UX Wireframes (Figma)

> **Figma Link:** _[Add your Figma link here after creating wireframes]_

**3 Core Viewports designed:**
1. **Auth Screen** — Split layout: branding panel (left) + login/register form (right)
2. **Student Dashboard** — Stats grid, enrolled courses, continue learning, recommendations
3. **Course Detail Page** — Video player area, lesson sidebar, enroll CTA card

**Design Tokens:**
- Primary: `#6C47FF` (Brand Purple)
- Background: `#F8F9FA`
- Dark: `#1A1A2E`
- Font: Inter (Google Fonts)

---

## 🗄 State Architecture Diagram

```
┌──────────────────────────────────────────────────┐
│                  Zustand Store                   │
│  ┌─────────────┐  ┌───────────────┐  ┌────────┐ │
│  │    Auth     │  │    Courses    │  │   UI   │ │
│  │ currentUser │  │ courses[]     │  │ search │ │
│  │ isLoggedIn  │  │ enrolledIds[] │  │ filter │ │
│  └─────────────┘  └───────────────┘  └────────┘ │
│           ↕ persist to localStorage              │
└──────────────────────────────────────────────────┘
         ↑ reads                    ↑ reads
┌─────────────────┐        ┌────────────────────┐
│   db.json       │        │  React Components  │
│ users[]         │        │ Dashboard          │
│ courses[]       │        │ CourseCard         │
│ progress{}      │        │ CourseDetail       │
│ categories[]    │        │ InstructorPortal   │
└─────────────────┘        └────────────────────┘
```

---

## 🚀 How to Run Locally

```bash

# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
# http://localhost:3000
```

### Test Credentials
| Role | Email | Password |
|------|-------|----------|
| Student | arjun@example.com | student123 |
| Instructor | priya@example.com | instructor123 |



---

## 📅 Sprint Roadmap

| Sprint | Goal | Status |
|--------|------|--------|
| 13 | Architecture Blueprint, PRD, Wireframes | ✅ Current |
| 14 | MVP: Auth, Dashboard, Course Catalog, Detail | 🔜 |
| 15 | Full CRUD: Instructor portal, Progress tracking | 🔜 |
| 16 | AI Recommendations + UX Polish | 🔜 |
| 17 | CI/CD + Final Deployment + Demo Video | 🔜 |

---

## 👤 Developer

**Sayyad Aafrin**  
Frontend Capstone
