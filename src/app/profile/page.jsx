'use client';

import { useAppContext } from '@/context/context';
import { useNotice } from '@/context/noticeContext';
import { useEffect, useState } from 'react';
import NoticeCard from '@/components/noticecard';
import { FaUserCircle } from 'react-icons/fa';
import {LuEye, LuEyeOff} from 'react-icons/lu';

export default function ProfilePage() {
	const { userContext, setUserContext } = useAppContext();
	const { addNotice } = useNotice();

	const [name, setName] = useState(userContext.name);
	const [email, setEmail] = useState(userContext.email);
	const [password, setPassword] = useState(userContext.password);
	const [showPassword, setShowPassword] = useState(false);
	const [editing, setEditing] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setName(userContext.name);
		setEmail(userContext.email);
		setPassword(userContext.password);
	}, [userContext]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const res = await fetch('/api/user', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: userContext.id, name, email, password }),
			});
			if (!res.ok) throw new Error(await res.text());
			const data = await res.json();
			if (data.success) {
				setUserContext({ ...userContext, name, email, password });
				addNotice('Profile updated successfully');
				sessionStorage.setItem('user', JSON.stringify({ ...userContext, name, email, password }));
			} else {
				console.error('Update failed:', data);
				addNotice('Profile updated fail', true);
			}
		} catch (err) {
			console.error('Error updating user:', err);
			addNotice('Profile updated fail', true);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<div className="p-4">

				<section className="flex justify-center items-center min-h-100 mt-3">
					<div className="shadow rounded-sm bg-light overflow-hidden flex flex-col items-center w-full max-w-md">
						<div className="w-full flex justify-center items-center pt-6">
							<FaUserCircle className="text-main text-7xl" />
						</div>

						<div className="px-4 py-4 w-full">
							{editing ? (
								<form onSubmit={handleSubmit} className="flex flex-col gap-3">
									<input
										type="text"
										value={name}
										onChange={(e) => setName(e.target.value)}
										className="border border-myBorder rounded px-3 py-2"
										placeholder="Name"
										required
									/>
									<input
										type="email"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className="border border-myBorder rounded px-3 py-2"
										placeholder="Email"
										required
									/>
									<div className="relative mb-4">
										<input
											type={showPassword ? 'text' : 'password'}
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											autoComplete="current-password"
											placeholder="Password"
											className="border border-myBorder rounded px-3 py-2 w-full"
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
									<div className="flex justify-between gap-2">
										<button
											type="submit"
											className="bg-theme text-white px-4 py-2 rounded"
											disabled={loading}
										>
											{loading ? 'Updating...' : 'Save'}
										</button>
										<button
											type="button"
											className="bg-gray-300 text-black px-4 py-2 rounded"
											onClick={() => setEditing(false)}
										>
											Cancel
										</button>
									</div>
								</form>
							) : (
								<div className="text-center">
									<p className="text-xl font-medium text-main mb-1">{userContext.name}</p>
									<p className="text-sm text-main/50 mb-3">{userContext.email}</p>
									<button
										className="bg-theme text-white px-4 py-2 rounded"
										onClick={() => setEditing(true)}
									>
										Edit Profile
									</button>
								</div>
							)}
						</div>
					</div>
				</section>
			</div>
		</>
	);
}
