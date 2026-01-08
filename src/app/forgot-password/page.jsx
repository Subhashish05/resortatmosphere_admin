'use client';

import { useState } from 'react';
import Link from 'next/link';
import NoticeCard from '@/components/noticecard';

export default function ForgotPasswordPage() {
	const [formData, setFormData] = useState({ email: '' });
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
		setMessage('');
		setError('');
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setMessage('');
		setError('');
		setIsSubmitting(true);

		try {
			const res = await fetch('/api/forgot-password', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: formData.email }),
			});

			const data = await res.json();

			if (!data.success) {
				setError(data.error || 'Failed to send reset link');
			} else {
				setMessage(data.message || 'Password reset link sent! Check your email.');
				setFormData({ email: '' });
			}
		} catch (err) {
			setError(err.message || 'Something went wrong');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			<NoticeCard isError={!!error} notice={message || error} />
			<div className="login_container h-screen relative flex items-center justify-center">
				<div className="bg-mid p-6 rounded-lg w-full max-w-md shadow">
					<h2 className="text-2xl mb-4 text-center">Forgot Password</h2>
					<p className="text-sm text-center mb-4 text-main">
						Enter your email address and we'll send you a link to reset your password.
					</p>
					<form onSubmit={handleSubmit} className="space-y-4 text-base">
						<input
							type="email"
							name="email"
							placeholder="Email"
							className="shadow border-t-2 border-t-highlight w-full p-2 md:p-3 rounded bg-[#eee] dark:bg-[#1f1f1f]"
							value={formData.email}
							autoComplete="email"
							onChange={handleChange}
							required
						/>
						<button
							type="submit"
							className="shadow border-t-2 border-t-highlight w-full bg-theme py-2 rounded hover:bg-yellow-700 transition text-main"
							disabled={isSubmitting}
						>
							{isSubmitting ? 'Sending...' : 'Send Reset Link'}
						</button>
					</form>

					<p className="my-2 text-sm text-center text-main">
						Remember your password?{' '}
						<Link href="/login" className="text-theme hover:underline">
							Login
						</Link>
					</p>
				</div>
			</div>
		</>
	);
}
