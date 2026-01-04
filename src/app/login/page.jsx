'use client';

import { useState } from 'react';
import { useAppContext } from '@/context/context';
import NoticeCard from '@/components/noticecard';
import { LuEye, LuEyeOff } from 'react-icons/lu';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
	const { setUserContext } = useAppContext();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');
	const [error, setError] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);

	const handleLogin = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(false);
		setMessage('');

		try {
			const res = await fetch('/api/v1/login', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password }),
			});

			const data = await res.json();
			if (!res.ok) throw new Error(data.error || 'Login failed');

			// Save to context
			setUserContext(data.user);

			setMessage(data.message || 'Login successful');
			window.location.reload();
		} catch (err) {
			setError(true);
			setMessage(err.message || 'Something went wrong');
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<NoticeCard key={message} isError={error} notice={message} />

			<div className="login_container p-4 h-screen w-full">
				<div className="bg-mid pb-8 px-8 rounded-sm shadow w-full max-w-md">
					<Image src="/img/logo.png" alt="Resort Atmosphere" width={160} height={160} className="mx-auto" />
					<form onSubmit={handleLogin} className="space-y-4">
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							autoComplete="email"
							placeholder="Email"
							className="shadow w-full px-4 py-2 bg-[#eee] dark:bg-[#111] rounded focus:outline-none"
						/>

						<div className="relative mb-4">
							<input
								type={showPassword ? 'text' : 'password'}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								autoComplete="current-password"
								placeholder="Password"
								className="shadow w-full px-4 py-2 bg-[#eee] dark:bg-[#111] rounded focus:outline-none pr-10"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-2 top-1/2 -translate-y-1/2 text-muted"
								tabIndex={-1}
								aria-label="Toggle password visibility"
							>
								{showPassword ? <LuEyeOff size={20} /> : <LuEye size={20} />}
							</button>
						</div>

						<button
							type="submit"
							disabled={loading}
							className={`shadow w-full py-2 rounded font-semibold transition text-white ${
								loading ? 'bg-yellow-600 cursor-not-allowed' : 'bg-theme hover:bg-yellow-600'
							}`}
						>
							{loading ? 'Logging In...' : 'Log In'}
						</button>
					</form>

					<p className="text-center text-base mt-4">
						<Link href="/forgot-password" className="text-red-500 font-light">
							Forgot Password ?
						</Link>
					</p>
				</div>
			</div>
		</>
	);
}
