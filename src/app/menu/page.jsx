'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { BiFoodTag } from 'react-icons/bi';
import { FiSearch } from 'react-icons/fi';
import Category from '../order/category';
import ItemForm from './itemForm';

const fetchMenu = async () => {
	try {
		const res = await fetch(`/api/menu`);
		if (!res.ok) {
			throw new Error(`Error ${res.status}: Failed to fetch menu`);
		}
		const json = await res.json();
		return json.data;
	} catch (error) {
		console.error('fetchMenu Error:', error.message);
		return [];
	}
};

export default function MenuPage() {
	const [search, setSearch] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');
	const [menuItem, setMenuItem] = useState({});

	const { data, isLoading } = useQuery({
		queryKey: ['menu'],
		queryFn: fetchMenu,
		staleTime: 360 * 1000,
	});

	// Filtering logic
	const filteredMenu = useMemo(() => {
		if (!data) return [];

		return data.filter((item) => {
			const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());

			const matchesCategory =
				selectedCategory === 'All' || !selectedCategory ? true : item.selectedCategory === selectedCategory;

			return matchesSearch && matchesCategory;
		});
	}, [data, search, selectedCategory]);

	return (
		<section className="flex flex-wrap justify-center items-start mb-4">
			<section className="w-full md:w-3/5 relative">
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
				</div>

				<Category selectedCategory={selectedCategory} setCategory={setSelectedCategory} />

				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 lg:gap-4 pt-2 px-2 pb-10 md:pb-0">
					{isLoading
						? Array.from({ length: 12 }).map((_, i) => (
								<div key={i} className="h-51 animate-pulse bg-light w-full text-center"></div>
						  ))
						: filteredMenu.map((menu) => (
								<div key={menu.id} onClick={() => setMenuItem(menu)}>
									<div className="flex flex-col h-full bg-light shadow rounded-sm overflow-hidden cursor-pointer relative active:brightness-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all select-none">
										<BiFoodTag
											className={`absolute top-0 right-0 size-6 ${
												menu.isVeg ? 'fill-green-500' : 'fill-red-500'
											}`}
										/>
										<Image
											src={`/menu/${menu.img}`}
											alt={menu.name}
											height={400}
											width={600}
											className="h-32 w-auto object-cover mx-auto shrink-0"
											draggable="false"
											loading="lazy"
										/>

										{/* Title: flex-grow ensures this area takes up available space */}
										<div className="grow flex flex-col justify-center pb-1">
											<p className="text-sm lg:text-base font-light font-body text-center mt-0.5 px-1 leading-[1.1] tracking-wide">
												{menu.name}
											</p>
										</div>

										{/* Footer section: Stays at the bottom */}
										<div className="mt-auto mb-1">
											<p className="text-center font-bold leading-6">₹ {menu.price}</p>
											<p className="text-muted text-center text-[10px] md:text-xs min-h-4 px-1 font-light uppercase">
												{menu.description == null ? 'Normal' : menu.description}
											</p>
										</div>
									</div>
								</div>
						  ))}

					{!isLoading && filteredMenu.length === 0 && (
						<div className="w-full text-center py-10 text-gray-500">
							No items found matching your criteria.
						</div>
					)}
				</div>
			</section>

			<ItemForm initialData={menuItem} />
		</section>
	);
}
