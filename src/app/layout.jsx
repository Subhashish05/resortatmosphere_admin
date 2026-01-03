import 'bootstrap-icons/font/bootstrap-icons.css';
import '@/styles/globals.css';
import { ContextProvider } from '@/context/context';
import Header from '@/shared/header';
import Navigation from '@/shared/navigation';
import { cookies } from 'next/headers';
import { Roboto, Inter } from '@/lib/fonts';
import Script from 'next/script';

export default async function RootLayout({ children }) {
	const cookieStore = await cookies();
	const userCookie = cookieStore.get('tool_auth_token');
	const isLoggedIn = Boolean(userCookie);
	const theme = cookieStore.get('dark');
	const isDark = theme !== undefined ? theme.value : 'false';

	return (
		<html lang="en">
			<head>
				<title>Trading Tools</title>
				<meta
					name="description"
					content="Powerful trading tools to track markets, analyze charts, and make smarter investment decisions in real time."
				/>
				<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
			</head>
			<ContextProvider>
				<body className={`${Inter.variable} ${Roboto.variable} antialiased ${isDark === 'true' ? 'dark' : ''}`}>
					{!isLoggedIn ? (
						<main className="w-full">{children}</main>
					) : (
						<>
							<Header />
							<Navigation />
							<main className="bg-mid min-h-[calc(100vh-96px)]">{children}</main>
							<footer className="bg-mid w-full">
								<div className="text-[10px] md:text-xs text-muted text-center py-2">
									&copy; {new Date().getFullYear()} Bullion Bulls. All rights reserved.
								</div>
							</footer>
						</>
					)}
					{
						process.env.NODE_ENV === 'production' && 
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
					}
				</body>
			</ContextProvider>
		</html>
	);
}
