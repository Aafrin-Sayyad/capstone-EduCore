"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/store/useStore";
import Navbar from "@/components/layout/Navbar";
import CourseCard from "@/components/course/CourseCard";

export default function DashboardPage() {
  const { isLoggedIn, currentUser, courses, enrolledCourseIds, progress } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) router.push("/auth");
  }, [isLoggedIn, router]);

  if (!isLoggedIn || !currentUser) return null;

  const enrolledCourses = courses.filter((c) => enrolledCourseIds.includes(c.id));
  const recommendedCourses = courses.filter((c) => !enrolledCourseIds.includes(c.id)).slice(0, 3);

  // Stats
  const totalCompleted = Object.values(progress).filter((p) => p.percentage === 100).length;
  const avgProgress =
    enrolledCourses.length > 0
      ? Math.round(
          Object.values(progress).reduce((acc, p) => acc + p.percentage, 0) /
            enrolledCourses.length
        )
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome Banner */}
        <div
          className="rounded-2xl p-6 mb-8 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #1A1A2E, #6C47FF)" }}
        >
          <div className="relative z-10">
            <p className="text-purple-200 text-sm mb-1">Good morning 👋</p>
            <h1 className="text-white text-2xl font-bold mb-1">
              Welcome back, {currentUser.name.split(" ")[0]}!
            </h1>
            <p className="text-purple-200 text-sm">
              {enrolledCourses.length > 0
                ? `You have ${enrolledCourses.length} course${enrolledCourses.length > 1 ? "s" : ""} in progress. Keep it up!`
                : "Start learning today — browse our courses!"}
            </p>
          </div>
          <div className="absolute right-0 bottom-0 w-40 h-40 bg-white/5 rounded-full -mr-10 -mb-10" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Enrolled", value: enrolledCourses.length, icon: "📚" },
            { label: "Completed", value: totalCompleted, icon: "🏆" },
            { label: "Avg Progress", value: `${avgProgress}%`, icon: "📈" },
            { label: "Certificates", value: totalCompleted, icon: "🎓" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <p className="text-2xl font-bold" style={{ color: "#6C47FF" }}>{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* My Learning Section */}
        {enrolledCourses.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">My Learning</h2>
              <Link href="/courses" className="text-sm text-purple-600 font-medium hover:underline">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {enrolledCourses.map((course) => (
                <CourseCard key={course.id} course={course} showProgress />
              ))}
            </div>
          </section>
        )}

        {/* Continue Learning (last watched) */}
        {Object.keys(progress).length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Continue Where You Left Off</h2>
            <div className="space-y-3">
              {Object.entries(progress)
                .filter(([, p]) => p.percentage > 0 && p.percentage < 100)
                .map(([courseId, prog]) => {
                  const course = courses.find((c) => c.id === courseId);
                  if (!course) return null;
                  return (
                    <Link key={courseId} href={`/courses/${courseId}`}>
                      <div className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-4 hover:border-purple-200 transition-colors">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-gray-900 truncate">{course.title}</p>
                          <p className="text-xs text-gray-500 mb-2">{prog.percentage}% complete</p>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${prog.percentage}%`, background: "#6C47FF" }}
                            />
                          </div>
                        </div>
                        <span className="text-purple-600 text-sm font-medium flex-shrink-0">Resume →</span>
                      </div>
                    </Link>
                  );
                })}
            </div>
          </section>
        )}

        {/* Recommended Section */}
        {recommendedCourses.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recommended For You</h2>
              <Link href="/courses" className="text-sm text-purple-600 font-medium hover:underline">
                Browse all
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {recommendedCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
