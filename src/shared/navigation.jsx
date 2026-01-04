'use client';

import { useAppContext } from '@/context/context';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AiOutlineControl } from 'react-icons/ai';
import { CgWebsite } from 'react-icons/cg';
import { FaPercent } from 'react-icons/fa';
import { LuChartCandlestick, LuHouse } from 'react-icons/lu';
import { MdOutlineCandlestickChart, MdOutlineRestaurantMenu } from 'react-icons/md';

export default function Navigation() {
	const { isCollapse, setIsCollapse, windowWidth } = useAppContext();
	const pathname = usePathname();

	const handleNavClick = () => {
		if (windowWidth <= 480) {
			setIsCollapse(true);
		}
	};
	return (
		<nav
			className={`${
				isCollapse ? '-left-30 collapsed' : 'left-0'
			} bg-mid h-[calc(100vh-48px)] flex flex-col items-center transition-[left] duration-500 fixed top-12 w-15 z-51`}
		>
			<Link
				href={'/'}
				className={`my-4 text-center flex flex-col items-center text-xs ${
					pathname == '/' ? 'text-theme' : 'text-muted'
				}`}
				onClick={handleNavClick}
			>
				<LuHouse className="size-5" />
				Home
			</Link>
			<Link
				href={'/order'}
				className={`my-4 text-center flex flex-col items-center text-xs ${
					pathname == '/order' ? 'text-theme' : 'text-muted'
				}`}
				onClick={handleNavClick}
			>
				<MdOutlineRestaurantMenu className="size-5" />
				Order
			</Link>
			{/* <Link
				href={'/compare'}
				className={`my-4 text-center flex flex-col items-center text-xs ${
					pathname == '/compare' ? 'text-theme' : 'text-muted'
				}`}
				onClick={handleNavClick}
			>
				<LuChartCandlestick className="size-5" />
				Compare
			</Link>
			<Link
				href={'/percent'}
				className={`my-4 text-center flex flex-col items-center text-xs ${
					pathname == '/page1' ? 'text-theme' : 'text-muted'
				}`}
				onClick={handleNavClick}
			>
				<FaPercent className="size-4" />
				Percent
			</Link>
			<Link
				href={'/tip'}
				className={`my-4 text-center flex flex-col items-center text-xs ${
					pathname == '/tip' ? 'text-theme' : 'text-muted'
				}`}
				onClick={handleNavClick}
			>
				<AiOutlineControl className="size-5" />
				Tip
			</Link>
			<Link
				href={'/page3'}
				className={`my-4 text-center flex flex-col items-center text-xs ${
					pathname == '/page3' ? 'text-theme' : 'text-muted'
				}`}
				onClick={handleNavClick}
			>
				<CgWebsite className="size-5" />
				Page 3
			</Link> */}
		</nav>
	);
}
