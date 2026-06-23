import { create } from "zustand";
import { persist } from "zustand/middleware";
import db from "@/data/db.json";

// ---------- Types ----------
export type UserRole = "student" | "instructor";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  enrolledCourses?: string[];
  coursesCreated?: string[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: "video" | "quiz";
  isPreview: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorId: string;
  category: string;
  thumbnail: string;
  price: number;
  originalPrice: number;
  rating: number;
  totalReviews: number;
  totalStudents: number;
  totalLessons: number;
  duration: string;
  level: string;
  tags: string[];
  lessons: Lesson[];
}

export interface ProgressData {
  completedLessons: string[];
  lastWatched: string;
  percentage: number;
}

interface AppState {
  // Auth
  currentUser: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => { success: boolean; message: string };
  logout: () => void;

  // Courses
  courses: Course[];
  enrolledCourseIds: string[];
  enrollCourse: (courseId: string) => void;

  // Progress
  progress: Record<string, ProgressData>;
  markLessonComplete: (courseId: string, lessonId: string) => void;

  // UI state
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // ---- Auth ----
      currentUser: null,
      isLoggedIn: false,

      login: (email, password) => {
        // find user in mock db
        const found = (db.users as any[]).find(
          (u) => u.email === email && u.password === password
        );
        if (!found) {
          return { success: false, message: "Invalid email or password" };
        }
        const user: User = {
          id: found.id,
          name: found.name,
          email: found.email,
          role: found.role,
          avatar: found.avatar,
          enrolledCourses: found.enrolledCourses ?? [],
          coursesCreated: found.coursesCreated ?? [],
        };
        set({
          currentUser: user,
          isLoggedIn: true,
          enrolledCourseIds: found.enrolledCourses ?? [],
          progress: (db.progress as any)[found.id] ?? {},
        });
        return { success: true, message: "Login successful" };
      },

      logout: () =>
        set({ currentUser: null, isLoggedIn: false, enrolledCourseIds: [], progress: {} }),

      // ---- Courses ----
      courses: db.courses as Course[],
      enrolledCourseIds: [],

      enrollCourse: (courseId) => {
        const current = get().enrolledCourseIds;
        if (!current.includes(courseId)) {
          set({ enrolledCourseIds: [...current, courseId] });
        }
      },

      // ---- Progress ----
      progress: {},

      markLessonComplete: (courseId, lessonId) => {
        const prog = get().progress;
        const existing = prog[courseId] ?? { completedLessons: [], lastWatched: "", percentage: 0 };
        if (existing.completedLessons.includes(lessonId)) return;

        const course = get().courses.find((c) => c.id === courseId);
        const totalLessons = course?.lessons.length ?? 1;
        const newCompleted = [...existing.completedLessons, lessonId];
        const newPct = Math.round((newCompleted.length / totalLessons) * 100);

        set({
          progress: {
            ...prog,
            [courseId]: {
              completedLessons: newCompleted,
              lastWatched: lessonId,
              percentage: newPct,
            },
          },
        });
      },

      // ---- UI ----
      selectedCategory: "All",
      setSelectedCategory: (cat) => set({ selectedCategory: cat }),
      searchQuery: "",
      setSearchQuery: (q) => set({ searchQuery: q }),
    }),
    {
      name: "educore-storage",
      // only persist auth + enrollment state
      partialize: (state) => ({
        currentUser: state.currentUser,
        isLoggedIn: state.isLoggedIn,
        enrolledCourseIds: state.enrolledCourseIds,
        progress: state.progress,
      }),
    }
  )
);
