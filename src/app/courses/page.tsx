"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import Navbar from "@/components/layout/Navbar";
import CourseCard from "@/components/course/CourseCard";
import db from "@/data/db.json";

export default function CoursesPage() {
  const { isLoggedIn, courses, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) router.push("/auth");
  }, [isLoggedIn, router]);

  if (!isLoggedIn) return null;

  // Filter courses
  const filtered = courses.filter((c) => {
    const matchCat = selectedCategory === "All" || c.category === selectedCategory;
    const matchSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  const categories: string[] = db.categories;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Browse Courses</h1>
          <p className="text-gray-500 text-sm">
            {filtered.length} course{filtered.length !== 1 ? "s" : ""} available
          </p>
        </div>

        {/* Search (mobile) */}
        <div className="md:hidden mb-4">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 bg-white"
          />
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 flex-wrap mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? "text-white shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-purple-300"
              }`}
              style={selectedCategory === cat ? { background: "#6C47FF" } : {}}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((course) => (
              <CourseCard key={course.id} course={course} showProgress />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">No courses found</h3>
            <p className="text-gray-400 text-sm">Try a different search or category</p>
            <button
              onClick={() => { setSelectedCategory("All"); setSearchQuery(""); }}
              className="mt-4 px-5 py-2 rounded-xl text-white text-sm font-medium"
              style={{ background: "#6C47FF" }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
