"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import Navbar from "@/components/layout/Navbar";

export default function InstructorPage() {
  const { isLoggedIn, currentUser, courses } = useStore();
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", category: "", price: "", level: "Beginner", description: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) router.push("/auth");
    else if (currentUser?.role !== "instructor") router.push("/dashboard");
  }, [isLoggedIn, currentUser, router]);

  if (!isLoggedIn || currentUser?.role !== "instructor") return null;

  const myCourses = courses.filter((c) => c.instructorId === currentUser.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setShowForm(false);
    setFormData({ title: "", category: "", price: "", level: "Beginner", description: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Instructor Portal</h1>
            <p className="text-gray-500 text-sm">Manage your courses and track performance</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2.5 rounded-xl text-white text-sm font-medium"
            style={{ background: "#6C47FF" }}
          >
            + New Course
          </button>
        </div>

        {/* Success Toast */}
        {submitted && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm mb-6">
            ✅ Course submitted for review! It will be published after approval.
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Courses", value: myCourses.length, icon: "📚" },
            {
              label: "Total Students",
              value: myCourses.reduce((a, c) => a + c.totalStudents, 0).toLocaleString(),
              icon: "👥",
            },
            {
              label: "Avg Rating",
              value: myCourses.length > 0
                ? (myCourses.reduce((a, c) => a + c.rating, 0) / myCourses.length).toFixed(1)
                : "N/A",
              icon: "⭐",
            },
            {
              label: "Revenue (Est.)",
              value:
                "₹" +
                myCourses
                  .reduce((a, c) => a + c.price * c.totalStudents * 0.7, 0)
                  .toLocaleString("en-IN", { maximumFractionDigits: 0 }),
              icon: "💰",
            },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <p className="text-xl font-bold" style={{ color: "#6C47FF" }}>{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* My Courses Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">My Courses</h2>
          </div>
          {myCourses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-3xl mb-2">📭</p>
              <p className="text-gray-500 text-sm">No courses created yet. Click "New Course" to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Course</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Category</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Students</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Rating</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Price</th>
                    <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {myCourses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img src={course.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover" />
                          <span className="font-medium text-gray-800 max-w-xs truncate">{course.title}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-500">{course.category}</td>
                      <td className="px-5 py-4 text-gray-700 font-medium">{course.totalStudents.toLocaleString()}</td>
                      <td className="px-5 py-4 text-yellow-500 font-medium">⭐ {course.rating}</td>
                      <td className="px-5 py-4 text-gray-700">₹{course.price}</td>
                      <td className="px-5 py-4">
                        <span className="bg-green-50 text-green-700 text-xs font-medium px-2 py-1 rounded-lg">Published</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* New Course Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-gray-900">Create New Course</h2>
                <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Complete Web Development Bootcamp"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                    >
                      <option value="">Select</option>
                      <option>Web Development</option>
                      <option>Data Science</option>
                      <option>Design</option>
                      <option>Backend</option>
                      <option>Cloud</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                    >
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="499"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="What will students learn in this course?"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium"
                    style={{ background: "#6C47FF" }}
                  >
                    Submit for Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
