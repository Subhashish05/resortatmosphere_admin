'use client';

import { useAppContext } from '@/context/context';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BiFoodMenu } from 'react-icons/bi';
import { FaRegImage } from 'react-icons/fa6';
import { GrContact } from 'react-icons/gr';
import { IoBedOutline } from 'react-icons/io5';
import { LuHouse, LuUsers } from 'react-icons/lu';
import { MdOutlineRateReview, MdOutlineRestaurantMenu } from 'react-icons/md';

export default function Navigation() {
	const { isCollapse, setIsCollapse, windowWidth } = useAppContext();
	const pathname = usePathname();

	const handleNavClick = () => {
		setIsCollapse(true);
	};
	return (
		<nav
			className={`${
				isCollapse ? '-left-30 collapsed' : 'left-0'
			} bg-light h-[calc(100vh-48px)] flex flex-col items-center transition-[left] duration-500 fixed top-12 w-15 z-51`}
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
			<Link
				href={'/menu'}
				className={`my-4 text-center flex flex-col items-center text-xs ${
					pathname == '/menu' ? 'text-theme' : 'text-muted'
				}`}
				onClick={handleNavClick}
			>
				<BiFoodMenu className="size-5" />
				Menu
			</Link>
			<Link
				href={'/staff'}
				className={`my-4 text-center flex flex-col items-center text-xs ${
					pathname == '/staff' ? 'text-theme' : 'text-muted'
				}`}
				onClick={handleNavClick}
			>
				<LuUsers className="size-5" />
				Staff
			</Link>
			<Link
				href={'/booking'}
				className={`my-4 text-center flex flex-col items-center text-xs ${
					pathname == '/booking' ? 'text-theme' : 'text-muted'
				}`}
				onClick={handleNavClick}
			>
				<IoBedOutline className="size-5" />
				Booking
			</Link>
			<Link
				href={'/contact'}
				className={`my-4 text-center flex flex-col items-center text-xs ${
					pathname == '/contact' ? 'text-theme' : 'text-muted'
				}`}
				onClick={handleNavClick}
			>
				<GrContact className="size-5" />
				Contact
			</Link>
			<Link
				href={'/gallery'}
				className={`my-4 text-center flex flex-col items-center text-xs ${
					pathname == '/gallery' ? 'text-theme' : 'text-muted'
				}`}
				onClick={handleNavClick}
			>
				<FaRegImage className="size-5" />
				Gallery
			</Link>
			<Link
				href={'/review'}
				className={`my-4 text-center flex flex-col items-center text-xs ${
					pathname == '/review' ? 'text-theme' : 'text-muted'
				}`}
				onClick={handleNavClick}
			>
				<MdOutlineRateReview className="size-5" />
				Review
			</Link>
		</nav>
	);
}
