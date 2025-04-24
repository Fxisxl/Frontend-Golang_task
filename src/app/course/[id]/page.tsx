'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

export default function CourseDetailPage() {
    const { id } = useParams(); // get dynamic course ID
    const { token } = useAuth();
    const [rating, setRating] = useState<number>(0);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [courseName, setCourseName] = useState('');

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/courses/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCourseName(res.data.name);
                setRating(res.data.rating || 0);
            } catch (err: any) {
                setError(err.response?.data?.message || 'Failed to fetch course');
            }
        };

        if (token) fetchCourseDetails();
    }, [id, token]);

    const handleRatingSubmit = async () => {
        if (!rating || rating < 1 || rating > 100) {
            alert('Please enter a rating between 1 and 100');
            return;
        }

        try {
            setSubmitting(true);
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/courses/rate`,
                { course_id: Number(id), rating },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert('Thanks for rating!');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Rating failed');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen p-6 bg-black text-white">
            {error && <p className="text-red-500">{error}</p>}

            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center">{courseName || 'Course Details'}</h1>

                {/* Dummy syllabus */}
                <div className="bg-gray-800 p-6 rounded-xl shadow mb-6">
                    <h2 className="text-xl font-semibold mb-4">Course Syllabus</h2>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Module 1:</strong> Introduction to the subject</li>
                        <li><strong>Module 2:</strong> Key Concepts and Tools</li>
                        <li><strong>Module 3:</strong> Hands-on Projects</li>
                        <li><strong>Module 4:</strong> Final Assessment</li>
                    </ul>
                </div>

                {/* Rating input */}
                <div className="flex items-center space-x-4">
                    <input
                        type="number"
                        min="1"
                        max="100"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className="w-20 p-2 rounded bg-gray-700 text-white appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        disabled={submitting}
                    />
                    <button
                        onClick={handleRatingSubmit}
                        className="bg-blue-600 px-4 py-2 rounded text-white"
                        disabled={submitting}
                    >
                        {submitting ? 'Submitting...' : 'Submit Rating'}
                    </button>
                </div>
            </div>
        </main>
    );
}
