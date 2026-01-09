'use client';

import { useAppContext } from '@/context/context';
import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { BsCartXFill } from 'react-icons/bs';
import Category from './category';
import Menu from './menu';
import Cart from './cart';


export default function OrderPage() {
	const [search, setSearch] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');
	const { setOrderList } = useAppContext();

	return (
		<section className="flex flex-wrap justify-center items-start mb-4">
			{/* menu area */}
			<section className="w-full md:w-3/5 h-full relative">

				<div className="sticky px-2 pt-3 pb-4 top-12 md:top-12 z-1 bg-dark flex justify-between items-center">
					<div className="relative grow mr-4">
						<label htmlFor="search" className="absolute top-1/2 -translate-y-1/2 left-2">
							<FiSearch className="size-5 stroke-theme" />
						</label>
						<input
							type="search"
							name="search"
							id="search"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search item.."
							className="placeholder:font-light w-full h-8 rounded-4xl bg-light shadow pl-8 pr-2 outline-none"
						/>
					</div>
					<button
						onClick={() => setOrderList([])}
						className="whitespace-nowrap h-8 px-6 rounded-4xl bg-[hsl(0,75%,50%)] dark:bg-[hsl(0,75%,40%)] text-white text-sm lg:text-base shadow text-center flex items-center font-light"
					>
						<BsCartXFill className="size-4 mr-1" />
						Clear Cart
					</button>
				</div>

				<Category category={selectedCategory} setCategory={setSelectedCategory} />

				<Menu search={search} category={selectedCategory} />
			</section>

			{/* Cart area */}
			<Cart />

		</section>
	);
}
