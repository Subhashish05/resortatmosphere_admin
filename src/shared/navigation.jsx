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
			} bg-light h-[calc(100vh-48px)] flex flex-col items-center transition-[left] duration-500 fixed top-12 w-15 z-51 border-r border-myBorder`}
		>
			<Link
				href={'/'}
				className={`w-full py-2 my-2 text-center flex flex-col items-center text-xs ${
					pathname == '/' ? 'text-theme bg-mid border border-l-0 border-r-0' : 'text-muted'
				}`}
				onClick={handleNavClick}
			>
				<LuHouse className="size-5" />
				Home
			</Link>
			<Link
				href={'/order'}
				className={`w-full py-2 my-2 text-center flex flex-col items-center text-xs ${
					pathname == '/order' ? 'text-theme bg-mid border border-l-0 border-r-0' : 'text-muted'
				}`}
				onClick={handleNavClick}
			>
				<MdOutlineRestaurantMenu className="size-5" />
				Order
			</Link>
			<Link
				href={'/menu'}
				className={`w-full py-2 my-2 text-center flex flex-col items-center text-xs ${
					pathname == '/menu' ? 'text-theme bg-mid border border-l-0 border-r-0' : 'text-muted'
				}`}
				onClick={handleNavClick}
			>
				<BiFoodMenu className="size-5" />
				Menu
			</Link>
			<Link
				href={'/staff'}
				className={`w-full py-2 my-2 text-center flex flex-col items-center text-xs ${
					pathname == '/staff' ? 'text-theme bg-mid border border-l-0 border-r-0' : 'text-muted'
				}`}
				onClick={handleNavClick}
			>
				<LuUsers className="size-5" />
				Staff
			</Link>
			<Link
				href={'/booking'}
				className={`w-full py-2 my-2 text-center flex flex-col items-center text-xs ${
					pathname == '/booking' ? 'text-theme bg-mid border border-l-0 border-r-0' : 'text-muted'
				}`}
				onClick={handleNavClick}
			>
				<IoBedOutline className="size-5" />
				Booking
			</Link>
			<Link
				href={'/contact'}
				className={`w-full py-2 my-2 text-center flex flex-col items-center text-xs ${
					pathname == '/contact' ? 'text-theme bg-mid border border-l-0 border-r-0' : 'text-muted'
				}`}
				onClick={handleNavClick}
			>
				<GrContact className="size-5" />
				Contact
			</Link>
			<Link
				href={'/gallery'}
				className={`w-full py-2 my-2 text-center flex flex-col items-center text-xs ${
					pathname == '/gallery' ? 'text-theme bg-mid border border-l-0 border-r-0' : 'text-muted'
				}`}
				onClick={handleNavClick}
			>
				<FaRegImage className="size-5" />
				Gallery
			</Link>
			<Link
				href={'/review'}
				className={`w-full py-2 my-2 text-center flex flex-col items-center text-xs ${
					pathname == '/review' ? 'text-theme bg-mid border border-l-0 border-r-0' : 'text-muted'
				}`}
				onClick={handleNavClick}
			>
				<MdOutlineRateReview className="size-5" />
				Review
			</Link>
		</nav>
	);
}
