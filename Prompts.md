# Prompts.md — AI Architectural Queries Log

> As per Corporate AI Policy, this file documents all AI prompts used during the planning phase of the EduCore Capstone Project.

---

## Sprint 13 — Architecture & Planning Phase

---

### Prompt 1 — Project Selection & Stack Decision

**Date:** Sprint 13, Day 1  
**Tool:** Claude (Anthropic)

**My Prompt:**
> "I am building an LMS (like Udemy) as a frontend project using Next.js. What should my tech stack be and what core features should I include in my MVP?"

**AI Response Summary:**
The AI recommended Next.js 14 with the App Router for routing, Tailwind CSS for fast styling, and Zustand for global state management because it's simpler than Redux for a solo project. For data, since this is a frontend-only track, it suggested using a `db.json` mock file combined with LocalStorage persistence via Zustand's `persist` middleware. Core MVP features recommended: Auth screen, course catalog, course detail with lesson list, and progress tracking.

**How I used this:**
I chose this exact stack. I evaluated Redux Toolkit vs Zustand and picked Zustand because it has less boilerplate, which makes sense for a solo project with a tight deadline.

---

### Prompt 2 — Zustand Store Architecture

**Date:** Sprint 13, Day 2  
**Tool:** Claude (Anthropic)

**My Prompt:**
> "How should I structure my Zustand store for an LMS app? I need to handle: user authentication (student vs instructor roles), enrolled courses, and lesson progress tracking."

**AI Response Summary:**
The AI suggested splitting the store into logical slices — Auth, Courses, Progress, and UI — all within a single `create()` call. It highlighted using Zustand's `persist` middleware with `partialize` to only save auth and enrollment data to localStorage (not derived/computed state like the full course list). It also warned against storing entire course objects in localStorage to avoid bloating storage.

**What I decided differently:**
I kept all slices in one store file (`useStore.ts`) for simplicity instead of splitting into separate files, since this is a single-developer project and the store isn't large enough to justify splitting.

---

### Prompt 3 — Folder Structure for Next.js App Router

**Date:** Sprint 13, Day 2  
**Tool:** Claude (Anthropic)

**My Prompt:**
> "What is the recommended folder structure for a Next.js 14 App Router project that has these pages: Auth, Student Dashboard, Course Catalog, Course Detail (dynamic route), Instructor Portal, and Profile?"

**AI Response Summary:**
The AI explained that with App Router, each folder under `src/app/` becomes a route. For dynamic routes like course detail, I should use the `[id]` folder convention (`/courses/[id]/page.tsx`). It recommended separating `components/` by domain (layout, course, dashboard) rather than by type (atoms, molecules) for a project of this size.

**How I used this:**
I followed this structure exactly. The `[id]` dynamic route pattern was new to me — I had previously only used the `pages/` directory approach from Next.js 12.

---

### Prompt 4 — Mock Database Schema Design

**Date:** Sprint 13, Day 3  
**Tool:** Claude (Anthropic)

**My Prompt:**
> "I need to design a mock db.json file for an LMS. What collections/objects should I include and how should they relate to each other? My app needs: users (student + instructor roles), courses with lessons, enrollment tracking, and lesson progress."

**AI Response Summary:**
The AI laid out 4 main "collections": `users`, `courses`, `progress`, and `categories`. For courses, it suggested embedding `lessons[]` directly inside each course object (rather than a separate lessons collection) since this is a read-heavy mock setup and embedding avoids join logic on the frontend. Progress was structured as a nested object: `{ userId: { courseId: { completedLessons[], percentage } } }`.

**My modification:**
I simplified progress to be keyed only by `courseId` inside the store (not userId) since the logged-in user is already known from auth state. This reduces lookup complexity in the frontend code.

---

### Prompt 5 — Responsive Layout Strategy

**Date:** Sprint 13, Day 4  
**Tool:** Claude (Anthropic)

**My Prompt:**
> "For mobile responsiveness in Tailwind CSS, what breakpoints should I use for a course catalog grid that shows 1 column on mobile, 2 on tablet, and 3 on desktop?"

**AI Response Summary:**
The AI explained Tailwind's mobile-first approach: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`. It also advised making the Navbar collapse to a hamburger menu below the `md:` breakpoint and switching the Course Detail page from a 2-column layout to a single column on mobile (stacking the sidebar below the video).

**How I used this:**
Directly applied these Tailwind classes. I also added a mobile search bar that's hidden on desktop (the navbar search handles that), shown only on the courses page for mobile users.

---

### Prompt 6 — Role-Based Access Control (Frontend)

**Date:** Sprint 13, Day 5  
**Tool:** Claude (Anthropic)

**My Prompt:**
> "How do I implement basic role-based access control in a Next.js frontend-only app? I have two roles: student and instructor. The instructor route should only be accessible to instructors."

**AI Response Summary:**
Since there's no backend, the AI recommended using a `useEffect` redirect pattern inside each protected page: check the `currentUser.role` from the Zustand store and call `router.push()` if unauthorized. It cautioned that this is UI-level protection only (not real security) and that real RBAC would require server-side middleware. For the capstone scope, UI-level guards are acceptable.

**How I used this:**
I added this pattern to `instructor/page.tsx`:
```ts
useEffect(() => {
  if (!isLoggedIn) router.push("/auth");
  else if (currentUser?.role !== "instructor") router.push("/dashboard");
}, [isLoggedIn, currentUser]);
```

---

### Prompt 7 — Deployment to Vercel

**Date:** Sprint 13, Day 6  
**Tool:** Claude (Anthropic)

**My Prompt:**
> "How do I deploy a Next.js 14 project to Vercel? What are the exact steps including GitHub repo setup?"

**AI Response Summary:**
The AI gave a step-by-step: (1) Push code to a public GitHub repo, (2) Go to vercel.com and import the repo, (3) Vercel auto-detects Next.js and sets build settings, (4) Click Deploy. It also mentioned that the `VERCEL_URL` environment variable is auto-set, and that all Next.js features including App Router, dynamic routes, and client components work on Vercel's free Hobby plan.

**How I used this:**
Documented the deploy steps in the README.md. Will follow these during Sprint 17.

---

## Notes on AI Usage

All AI responses were used as reference and learning material. Final code was written and adapted by me based on my understanding of the concepts. I modified AI suggestions in several places (store structure, progress keying, component design) based on what made more sense for my specific use case.

> "AI is like having a senior dev you can ask questions to — but you still have to write the actual code yourself." — my takeaway from this process.
