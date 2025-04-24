'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

type Course = {
  id: number;
  name: string;
  rating: number; // Add rating field
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();
  const router = useRouter(); // To use the router for redirection

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        console.log("Fetching courses...");
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/courses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Fetched courses:", res.data);
        setCourses(res.data.map((c: any) => ({
          id: c.ID,
          name: c.name,
          rating: c.rating || 0, // Add default rating if none
        })));
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchCourses();
    } else {
      setError('No token found');
      setLoading(false);
    }
  }, [token]);

  const handleEnroll = async (courseId: number) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/courses/enroll`,
        { course_id: courseId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEnrolledCourses((prev) => [...prev, courseId]);

      // Redirect user to the course page after enrollment
      router.push(`/course/${courseId}`);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Enrollment failed');
    }
  };

  return (
    <main className="min-h-screen p-4 bg-black text-white">
      <h2 className="text-3xl font-semibold mb-6 text-center">Available Courses</h2>

      {loading && <p className="text-center text-gray-300">Loading courses...</p>}
      {error && <p className="text-red-400 text-center">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-gray-900 p-4 rounded-xl shadow border border-gray-700 group relative transition"
          >
            <h3 className="text-xl font-bold mb-2">{course.name}</h3>
            <p className="text-gray-300 mb-4">Rating: {course.rating}</p>

            {!enrolledCourses.includes(course.id) ? (
              <button
                onClick={() => handleEnroll(course.id)}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition rounded-xl"
              >
                Enroll
              </button>
            ) : (
              <div className="bg-gray-800 p-3 rounded mt-2 text-sm text-gray-200">
                <p><strong>Module 1:</strong> Introduction</p>
                <p><strong>Module 2:</strong> Fundamentals</p>
                <p><strong>Module 3:</strong> Final Project</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
