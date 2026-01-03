'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'; // install lucide-react if not already: npm i lucide-react

export default function ResetPasswordPage() {
    const router = useRouter();
	const param = useParams();
	const token = param.token;
	const [isAuth, setIsAuth] = useState(false);
	const [loading, setLoading] = useState(false);

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirm, setConfirm] = useState('');
	const [error, setError] = useState('');

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);

	useEffect(() => {
		const checkToken = async () => {
			setLoading(true);
			try {
				const res = await fetch(`/api/v1/forgot-password/${token}`);
				const data = await res.json();
				if (data.success) {
					setIsAuth(true);
					setLoading(false);
					setEmail(data.email);
				} else {
					alert('Invalid Token!!!');
				}
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};
		if (token) checkToken();
	}, [token]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (password.length < 8) {
			setError('Password must be at least 8 characters long.');
			return;
		}
		if (password !== confirm) {
			setError('Passwords do not match.');
			return;
		}

		setError('');
		try {
			const res = await fetch(`/api/v1/forgot-password`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password }),
			});
			if (!res.ok) {
				throw new Error(await res.text());
			}
			const json = await res.json();
			if(json.success){
                router.push('/login');
            }else{
                alert('Fail to reset password');
            }
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className="login_container h-screen relative flex items-center justify-center">
			{!loading && isAuth ? (
				<div className="bg-mid p-6 rounded-lg w-full max-w-md shadow">
					<h2 className="text-2xl mb-4 text-center">Reset Password</h2>
					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						{/* New Password */}
						<label className="relative block">
							New Password
							<input
								type={showPassword ? 'text' : 'password'}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="w-full mt-1 px-3 py-2 border border-myBorder rounded-md focus:outline-none"
								required
							/>
							<button
								type="button"
								onClick={() => setShowPassword((prev) => !prev)}
								className="absolute right-3 top-10 text-mute"
							>
								{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
							</button>
						</label>

						{/* Confirm Password */}
						<label className="relative block">
							Confirm Password
							<input
								type={showConfirm ? 'text' : 'password'}
								value={confirm}
								onChange={(e) => setConfirm(e.target.value)}
								className="w-full mt-1 px-3 py-2 border border-myBorder rounded-md focus:outline-none"
								required
							/>
							<button
								type="button"
								onClick={() => setShowConfirm((prev) => !prev)}
								className="absolute right-3 top-10 text-mute"
							>
								{showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
							</button>
						</label>

						{error && <div className="text-red-600 text-sm">{error}</div>}

						<button
							type="submit"
							className="py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition"
						>
							Reset Password
						</button>
					</form>

					<p className="my-2 text-sm text-center text-main">
						Remember your password?{' '}
						<Link href="/login" className="text-theme hover:underline">
							Login
						</Link>
					</p>
				</div>
			) : (
				<div className="mb-5 flex flex-col justify-center items-center">
					<div className="size-10 border-2 border-theme border-t-dark rounded-full animate-spin"></div>
					Loading...
				</div>
			)}
		</div>
	);
}
