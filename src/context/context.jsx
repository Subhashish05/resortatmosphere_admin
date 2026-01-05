'use client';

import { createContext, useContext, useLayoutEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { usePathname, useRouter } from 'next/navigation';

const AppContext = createContext();

const nullData = {
	id: null,
	email: null,
	name: null,
	password: null,
};
export const ContextProvider = ({ children }) => {
	const pathname = usePathname();
	const isDark = Cookies.get('dark');
	const [queryClient] = useState(() => new QueryClient());
	const [userContext, setUserContext] = useState(nullData);
	const [darkmode, setDarkmode] = useState(isDark);
	const [categories, setCategories] = useState([]);
	const [windowWidth, setWindowWidth] = useState(0);
	const [isCollapse, setIsCollapse] = useState(true);

	useLayoutEffect(() => {
		//theme assess
		if (isDark !== undefined) {
			if (isDark === 'true') setDarkmode(true);
			else setDarkmode(false);
		} else {
			if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
				document.querySelector('body').classList.add('dark');
				Cookies.set('dark', true, { expires: 30 });
				setDarkmode(true);
			} else {
				setDarkmode(false);
			}
		}
		//window width assess
		setWindowWidth(window.innerWidth);

		window.innerWidth <= 480 && setIsCollapse(true);
		const savedUser = sessionStorage.getItem('user');

		//user data assess
		if (savedUser) {
			setUserContext(JSON.parse(savedUser));
		} else {
			const fetchUser = async () => {
				try {
					const res = await fetch('/api/auth', { credentials: 'include' });

					if (!res.ok) {
						if (
							!Boolean(Cookies.get('atmosphere_auth_token')) &&
							pathname !== '/login' &&
							pathname !== '/forgot-password'
						) {
							fetch('/api/logout', {
								method: 'POST',
								credentials: 'include',
							});
							sessionStorage.removeItem('user');
							Cookies.remove('atmosphere_auth_token');
							window.location.reload();
						}
						setUserContext(nullData);
						return;
					}
					const data = await res.json();
					setUserContext(data.user);

					sessionStorage.setItem('user', JSON.stringify(data.user));
				} catch (err) {
					console.error('Error fetching user:', err);
					setUserContext(nullData);
				}
			};
			fetchUser();
		}
	}, []);

	return (
		<AppContext.Provider
			value={{
				userContext,
				setUserContext,
				categories,
				setCategories,
				darkmode,
				setDarkmode,
				windowWidth,
				isCollapse,
				setIsCollapse,
			}}
		>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</AppContext.Provider>
	);
};

export const useAppContext = () => useContext(AppContext);
