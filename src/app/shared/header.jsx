'use client';

import Cookies from 'js-cookie';
import { useAppContext } from '@/context/context';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { BiMoon, BiSun, BiUser } from 'react-icons/bi';
import { LuPanelLeftClose, LuPanelLeftOpen } from 'react-icons/lu';
import { LogOut } from 'lucide-react';

export default function Header() {
	const { darkmode, setDarkmode, userContext, setUserContext, isCollapse, setIsCollapse } = useAppContext();
	const profile = useRef();

	const toggleProfile = () => {
		profile.current.classList.toggle('show');
	};
	const handleLogout = async () => {
		try {
			const res = await fetch('/api/logout', {
				method: 'POST',
				credentials: 'include',
			});
			if (!res.ok) throw new Error('Logout failed');

			// clear client-side state/storage
			setUserContext({
				id: null,
				email: null,
				name: null,
				password: null,
				image: null,
			});
			sessionStorage.removeItem('user');

			// remove non-HttpOnly cookie if present (no-op for HttpOnly)
			Cookies.remove('tool_auth_token');
			window.location.reload();
		} catch (err) {
			console.error('Logout error:', err);
		}
	};

	const setTheme = () => {
		if (!darkmode) {
			setDarkmode(true);
			Cookies.set('dark', true, { expires: 30 });
			document.querySelector('body').classList.add('dark');
		} else {
			setDarkmode(false);
			Cookies.set('dark', false, { expires: 30 });
			document.querySelector('body').classList.remove('dark');
		}
	};

	useEffect(() => {
		if (isCollapse) {
			if (profile.current !== undefined) {
				profile.current.classList.remove('show');
			}
		}
	}, [isCollapse]);
	return (
		<header className="font-head bg-mid py-2 px-5 flex items-center justify-between h-12 w-full sticky top-0 left-0 z-50 shadow">
			<div>
				{isCollapse ? (
					<LuPanelLeftOpen
						className="size-6 cursor-pointer stroke-2 stroke-theme"
						onClick={() => setIsCollapse(false)}
					/>
				) : (
					<LuPanelLeftClose
						className="size-6 cursor-pointer stroke-2 stroke-theme"
						onClick={() => setIsCollapse(true)}
					/>
				)}
			</div>
			<div className='text-theme text-2xl flex items-center'> <img src="/logo.webp" alt="logo" className='h-12 w-auto mr-1.5' /></div>
			{userContext.email == null ? (
				<>
					<div className="relative header_btn">
						<button
							type="button"
							className="size-8 rounded-full bg-theme text-white text-xl leading-5 flex justify-center items-center overflow-hidden shadow"
						>
							<span className="block size-3 border border-white border-t-theme rounded-full animate-spin"></span>
						</button>
					</div>
				</>
			) : (
				<>
					<div className="relative header_btn">
						<button
							type="button"
							onClick={toggleProfile}
							className="size-8 rounded-full bg-theme text-white text-xl leading-5 flex justify-center items-center overflow-hidden shadow"
						>
							{userContext.image == null ? (
								<span>{userContext?.name.slice(0, 1).toUpperCase()}</span>
							) : (
								<img src="userContext.image" alt="user image" className="h-full w-full object-cover" />
							)}
						</button>
						<div className="profile" ref={profile}>
							<div className="bg-light flex items-center justify-between p-2 text-base">
								<div className="w-full ps-2 text-base">
									<p className="text-center">{userContext?.name}</p>
								</div>
							</div>
							<ul className="text-xs md:text-sm">
								<li className="border-t border-myBorder hover:bg-light">
									<Link href={'/profile'} className=" py-2 px-4 block" onClick={toggleProfile}>
										<BiUser className="inline me-2 size-4" /> Profile
									</Link>
								</li>
								<li
									className="border-t border-myBorder hover:bg-light py-2 px-4 cursor-pointer"
									onClick={setTheme}
								>
									{darkmode ? (
										<BiSun className="inline me-2 size-4" />
									) : (
										<BiMoon className="inline me-2 size-4" />
									)}
									{darkmode ? 'Light' : 'Dark'} Mode
								</li>
								<li
									className="border-t border-myBorder hover:bg-light py-2 px-4 cursor-pointer"
									onClick={handleLogout}
								>
									<LogOut className="inline me-2 size-4" /> Logout
								</li>
							</ul>
						</div>
					</div>
				</>
			)}
		</header>
	);
}
