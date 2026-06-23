"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useStore } from "@/store/useStore";
import Navbar from "@/components/layout/Navbar";

export default function CourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isLoggedIn, courses, enrolledCourseIds, enrollCourse, progress, markLessonComplete } = useStore();
  const [activeLesson, setActiveLesson] = useState<string | null>(null);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) router.push("/auth");
  }, [isLoggedIn, router]);

  const course = courses.find((c) => c.id === id);

  useEffect(() => {
    if (course) {
      setEnrolled(enrolledCourseIds.includes(course.id));
      // auto-set first lesson
      if (!activeLesson && course.lessons.length > 0) {
        setActiveLesson(course.lessons[0].id);
      }
    }
  }, [course, enrolledCourseIds]);

  if (!isLoggedIn || !course) return null;

  const courseProgress = progress[course.id];
  const activeLessonData = course.lessons.find((l) => l.id === activeLesson);

  const handleEnroll = () => {
    enrollCourse(course.id);
    setEnrolled(true);
  };

  const handleLessonClick = (lessonId: string) => {
    const lesson = course.lessons.find((l) => l.id === lessonId);
    if (!enrolled && !lesson?.isPreview) return;
    setActiveLesson(lessonId);
  };

  const handleMarkComplete = () => {
    if (activeLesson && enrolled) {
      markLessonComplete(course.id, activeLesson);
    }
  };

  const isLessonCompleted = (lessonId: string) =>
    courseProgress?.completedLessons.includes(lessonId) ?? false;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Video + Info */}
          <div className="lg:col-span-2">
            {/* Video Area */}
            <div
              className="rounded-2xl overflow-hidden mb-6 relative"
              style={{ background: "#1A1A2E", minHeight: "300px" }}
            >
              {enrolled || activeLessonData?.isPreview ? (
                <div className="flex flex-col items-center justify-center h-72 text-white">
                  <div className="text-6xl mb-4">▶️</div>
                  <h3 className="text-lg font-semibold mb-1">{activeLessonData?.title}</h3>
                  <p className="text-purple-300 text-sm">{activeLessonData?.duration}</p>
                  {enrolled && (
                    <button
                      onClick={handleMarkComplete}
                      className={`mt-4 px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                        isLessonCompleted(activeLesson ?? "")
                          ? "bg-green-500 text-white cursor-default"
                          : "bg-purple-600 text-white hover:bg-purple-700"
                      }`}
                    >
                      {isLessonCompleted(activeLesson ?? "") ? "✓ Completed" : "Mark as Complete"}
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-72 text-white">
                  <div className="text-6xl mb-4">🔒</div>
                  <p className="text-gray-400 text-sm">Enroll to watch this lesson</p>
                </div>
              )}
            </div>

            {/* Course Info */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-purple-50 text-purple-600 text-xs px-2 py-1 rounded-lg">{course.category}</span>
                <span className="bg-gray-50 text-gray-600 text-xs px-2 py-1 rounded-lg">{course.level}</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h1>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{course.description}</p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span>👤 {course.totalStudents.toLocaleString()} students</span>
                <span>⭐ {course.rating} ({course.totalReviews.toLocaleString()} reviews)</span>
                <span>📹 {course.totalLessons} lessons · {course.duration}</span>
              </div>
              <p className="mt-3 text-sm text-gray-500">
                Instructor: <span className="font-medium text-gray-700">{course.instructor}</span>
              </p>
            </div>

            {/* Progress (enrolled) */}
            {enrolled && courseProgress && (
              <div className="bg-white rounded-2xl p-5 border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-semibold text-gray-700">Your Progress</p>
                  <p className="text-sm font-bold" style={{ color: "#6C47FF" }}>{courseProgress.percentage}%</p>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${courseProgress.percentage}%`, background: "#6C47FF" }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {courseProgress.completedLessons.length} of {course.lessons.length} lessons completed
                </p>
              </div>
            )}
          </div>

          {/* Right: Sidebar */}
          <div className="lg:col-span-1">
            {/* Enroll Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-4 sticky top-20">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-36 object-cover rounded-xl mb-4"
              />
              <div className="mb-4">
                <span className="text-2xl font-bold text-gray-900">₹{course.price}</span>
                <span className="text-sm text-gray-400 line-through ml-2">₹{course.originalPrice}</span>
                <span className="ml-2 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-lg">
                  {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% off
                </span>
              </div>

              {enrolled ? (
                <div className="text-center">
                  <div className="bg-green-50 text-green-700 font-semibold py-3 rounded-xl mb-2 text-sm">
                    ✓ You are enrolled
                  </div>
                  <p className="text-xs text-gray-400">Click lessons on the left to start learning</p>
                </div>
              ) : (
                <button
                  onClick={handleEnroll}
                  className="w-full py-3 rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity"
                  style={{ background: "#6C47FF" }}
                >
                  Enroll Now — Free (Demo)
                </button>
              )}

              <div className="mt-4 space-y-2 text-xs text-gray-500">
                <p>✅ Full lifetime access</p>
                <p>✅ {course.totalLessons} video lessons</p>
                <p>✅ Certificate of completion</p>
                <p>✅ Mobile & desktop access</p>
              </div>
            </div>

            {/* Lessons List */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 text-sm">Course Content</h3>
              </div>
              <div className="divide-y divide-gray-50">
                {course.lessons.map((lesson, idx) => {
                  const isActive = activeLesson === lesson.id;
                  const isCompleted = isLessonCompleted(lesson.id);
                  const isLocked = !enrolled && !lesson.isPreview;

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => handleLessonClick(lesson.id)}
                      disabled={isLocked}
                      className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${
                        isActive ? "bg-purple-50" : isLocked ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs mt-0.5 ${
                          isCompleted
                            ? "bg-green-500 text-white"
                            : isActive
                            ? "text-white"
                            : "bg-gray-100 text-gray-500"
                        }`}
                        style={isActive && !isCompleted ? { background: "#6C47FF" } : {}}
                      >
                        {isCompleted ? "✓" : isLocked ? "🔒" : idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-medium leading-snug ${isActive ? "text-purple-700" : "text-gray-700"}`}>
                          {lesson.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {lesson.type === "quiz" ? "📝 " : "▶ "}
                          {lesson.duration}
                          {lesson.isPreview && <span className="ml-2 text-purple-500">Preview</span>}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
