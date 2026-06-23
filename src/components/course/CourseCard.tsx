"use client";
import Link from "next/link";
import { useStore, Course } from "@/store/useStore";

interface Props {
  course: Course;
  showProgress?: boolean;
}

export default function CourseCard({ course, showProgress = false }: Props) {
  const { progress, enrolledCourseIds } = useStore();
  const courseProgress = progress[course.id];
  const isEnrolled = enrolledCourseIds.includes(course.id);

  return (
    <Link href={`/courses/${course.id}`} className="block">
      <div className="course-card bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
        {/* Thumbnail */}
        <div className="relative h-44 overflow-hidden">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/400x220/6C47FF/ffffff?text=EduCore";
            }}
          />
          <div className="absolute top-3 left-3">
            <span className="bg-white/90 text-xs font-medium px-2 py-1 rounded-lg text-purple-700">
              {course.level}
            </span>
          </div>
          {isEnrolled && (
            <div className="absolute top-3 right-3">
              <span className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-lg">
                Enrolled ✓
              </span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-4">
          <div className="flex flex-wrap gap-1 mb-2">
            {course.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>

          <h3 className="font-semibold text-sm text-gray-900 leading-snug mb-1 line-clamp-2">
            {course.title}
          </h3>
          <p className="text-xs text-gray-500 mb-3">By {course.instructor}</p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <span className="text-yellow-400 text-xs">★★★★★</span>
            <span className="text-xs font-semibold text-gray-700">{course.rating}</span>
            <span className="text-xs text-gray-400">({course.totalReviews.toLocaleString()})</span>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
            <span>📹 {course.totalLessons} lessons</span>
            <span>⏱ {course.duration}</span>
          </div>

          {/* Progress bar (only for enrolled) */}
          {showProgress && isEnrolled && courseProgress && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{courseProgress.percentage}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${courseProgress.percentage}%`,
                    background: "#6C47FF",
                  }}
                />
              </div>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-50">
            <div>
              <span className="font-bold text-gray-900">₹{course.price}</span>
              <span className="text-xs text-gray-400 line-through ml-2">₹{course.originalPrice}</span>
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-lg">
              {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% off
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
