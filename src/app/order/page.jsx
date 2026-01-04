'use client';

import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

export default function OrderPage() {
	const [search, setSearch] = useState('');

	return (
		<section className="flex justify-center items-center h-full">
			{/* menu area */}
			<section className="w-full md:w-3/5 h-full">
				<div className="relative px-2">
					<label htmlFor="search" className="absolute top-1/2 -translate-y-1/2 left-4">
						<FiSearch className="size-5 stroke-theme" />
					</label>
					<input
						type="search"
						name="search"
						id="search"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search item.."
						className="placeholder:font-light w-full h-8 my-3 rounded-4xl border border-myBorder pl-8 pr-2 bg-black/5 outline-none focus:ring-amber-200 ring-1"
					/>
				</div>
				<div>categories</div>
				<div>menu cards</div>
			</section>

			{/* odering area */}
			<section className="w-full md:w-2/5 border min-h-[calc(100vh-64px)]">order details</section>
		</section>
	);
}
