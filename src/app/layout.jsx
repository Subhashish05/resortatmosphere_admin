import '@/styles/globals.css';
import { ContextProvider } from '@/context/context';
import { NoticeProvider } from '@/context/noticeContext';
import Header from '@/shared/header';
import Navigation from '@/shared/navigation';
import { cookies } from 'next/headers';
import { Roboto, Inter } from '@/lib/fonts';
import Script from 'next/script';
import Link from 'next/link';

export default async function RootLayout({ children }) {
	const cookieStore = await cookies();
	const userCookie = cookieStore.get('atmosphere_auth_token');
	const isLoggedIn = Boolean(userCookie);
	const theme = cookieStore.get('dark');
	const isDark = theme !== undefined ? theme.value : 'false';

	return (
		<html lang="en">
			<head>
				<title>Admin Panel | Resort Atmosphere</title>
				<meta
					name="description"
					content="Manage resort operations, guest bookings, and atmosphere settings through the centralized Resort Atmosphere admin dashboard."
				/>
				<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
			</head>
			<ContextProvider>
				<body className={`${Inter.variable} ${Roboto.variable} antialiased ${isDark === 'true' ? 'dark' : ''}`}>
					<NoticeProvider>
						{!isLoggedIn ? (
							<main className="w-full">{children}</main>
						) : (
							<>
								<Header />
								<Navigation />
								<main className="bg-mid min-h-[calc(100vh-64px)]">{children}</main>
								<footer className="bg-mid w-full border-t border-neutral-500">
									<div className="text-[10px] text-muted text-center">
										<span>
											&copy; {new Date().getFullYear()} Resort Atmosphere. All rights reserved.
										</span>
										<span className="block md:inline md:ml-1">
											Developed by{' '}
											<Link
												href="https://spfreelancer.com"
												target="_blank"
												rel="noopener noreferrer"
												className="hover:underline font-medium"
											>
												SP FREELANCER
											</Link>
										</span>
									</div>
								</footer>
							</>
						)}
					</NoticeProvider>
					{process.env.NODE_ENV === 'production' && (
						<Script id="disable-inspect" strategy="beforeInteractive">
							{`
								document.addEventListener("contextmenu", e => e.preventDefault());
								document.addEventListener("keydown", e => {
								if (
									e.key === "F12" ||
									(e.ctrlKey && e.shiftKey && e.key === "I") ||
									(e.ctrlKey && e.key === "U")
								) e.preventDefault();
								});
							`}
						</Script>
					)}
				</body>
			</ContextProvider>
		</html>
	);
}
