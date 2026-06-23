"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import Navbar from "@/components/layout/Navbar";

export default function ProfilePage() {
  const { isLoggedIn, currentUser, courses, enrolledCourseIds, progress, logout } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) router.push("/auth");
  }, [isLoggedIn, router]);

  if (!isLoggedIn || !currentUser) return null;

  const enrolledCourses = courses.filter((c) => enrolledCourseIds.includes(c.id));
  const completedCourses = enrolledCourses.filter(
    (c) => progress[c.id]?.percentage === 100
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
          <div className="flex items-start gap-5">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
              style={{ background: "#6C47FF" }}
            >
              {currentUser.avatar}
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900 mb-0.5">{currentUser.name}</h1>
              <p className="text-gray-500 text-sm mb-2">{currentUser.email}</p>
              <span
                className="text-xs font-medium px-3 py-1 rounded-lg capitalize"
                style={{
                  background: currentUser.role === "instructor" ? "#FEF3C7" : "#EDE9FE",
                  color: currentUser.role === "instructor" ? "#92400E" : "#6C47FF",
                }}
              >
                {currentUser.role}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Enrolled", value: enrolledCourses.length, icon: "📚" },
            { label: "Completed", value: completedCourses.length, icon: "🏆" },
            { label: "Certificates", value: completedCourses.length, icon: "🎓" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
              <p className="text-2xl mb-1">{s.icon}</p>
              <p className="text-2xl font-bold" style={{ color: "#6C47FF" }}>{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Enrolled Courses */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">My Courses</h2>
          </div>
          {enrolledCourses.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-400 text-sm mb-3">You haven&apos;t enrolled in any courses yet.</p>
              <Link
                href="/courses"
                className="text-purple-600 text-sm font-medium hover:underline"
              >
                Browse Courses →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {enrolledCourses.map((course) => {
                const prog = progress[course.id];
                return (
                  <Link key={course.id} href={`/courses/${course.id}`}>
                    <div className="px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                      <img src={course.thumbnail} alt="" className="w-12 h-12 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-800 truncate">{course.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-xs">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${prog?.percentage ?? 0}%`, background: "#6C47FF" }}
                            />
                          </div>
                          <span className="text-xs text-gray-400">{prog?.percentage ?? 0}%</span>
                        </div>
                      </div>
                      {prog?.percentage === 100 && (
                        <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-lg font-medium">
                          ✓ Done
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={() => { logout(); router.push("/auth"); }}
          className="w-full py-3 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
        >
          Log Out
        </button>
      </main>
    </div>
  );
}
