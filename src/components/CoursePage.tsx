'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

export default function CoursePage() {
  const { courseId } = useParams(); // Retrieve courseId from URL
  const [course, setCourse] = useState<any>(null);
  const [rating, setRating] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/courses/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCourse(res.data);
        setRating(res.data.rating || 0); // Set initial rating
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch course details');
      } finally {
        setLoading(false);
      }
    };

    if (courseId && token) {
      fetchCourseDetails();
    } else {
      setError('Course not found');
      setLoading(false);
    }
  }, [courseId, token]);

  const handleRatingSubmit = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/courses/rate`,
        { course_id: courseId, rating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Rating submitted successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit rating');
    }
  };

  return (
    <main className="min-h-screen p-4 bg-black text-white">
      {loading && <p className="text-center text-gray-300">Loading course details...</p>}
      {error && <p className="text-red-400 text-center">{error}</p>}

      {course && (
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6 text-center">{course.name}</h2>
          
          <div className="bg-gray-800 p-4 rounded-xl shadow mb-6">
            <h3 className="text-xl font-bold mb-4">Course Syllabus</h3>
            <p><strong>Module 1:</strong> Introduction</p>
            <p><strong>Module 2:</strong> Fundamentals</p>
            <p><strong>Module 3:</strong> Final Project</p>
          </div>

          <div className="flex justify-center items-center space-x-4">
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-16 p-2 bg-gray-700 text-white rounded"
            />
            <button
              onClick={handleRatingSubmit}
              className="bg-blue-600 p-2 rounded text-white"
            >
              Submit Rating
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
