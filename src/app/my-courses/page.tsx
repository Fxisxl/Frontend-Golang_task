'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

type Course = {
  ID: number;
  name: string;
  rating?: number;
};

export default function MyCoursesPage() {
  const { token } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      setError('Not logged in');
      setLoading(false);
      return;
    }

    const fetchEnrolledCourses = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/courses/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // Ensure courses is always an array, even if the response is empty or null
        setCourses(res.data || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch enrolled courses');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [token]);

  if (loading) return <p className="text-center text-gray-300">Loading your courses...</p>;
  if (error) return <p className="text-center text-red-400">{error}</p>;

  return (
    <main className="min-h-screen p-6 bg-black text-white">
      <h2 className="text-3xl font-semibold mb-6 text-center">My Enrolled Courses</h2>

      {courses.length === 0 ? (
        <p className="text-center text-gray-400">No courses enrolled</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.ID}
              className="bg-gray-900 p-4 rounded-xl shadow border border-gray-700 cursor-pointer hover:border-blue-500 transition"
              onClick={() => router.push(`/course/${course.ID}`)}
            >
              <h3 className="text-xl font-bold">{course.name}</h3>
              {course.rating && (
                <p className="text-gray-400 mt-2 text-sm">Rating: {course.rating.toFixed(1)} / 100</p>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
