import { useAppContext } from '@/context/context';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { useMemo } from 'react';
import { BiFoodTag } from 'react-icons/bi';

const fetchMenu = async () => {
	try {
		const res = await fetch(`/api/v1/menu`);
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

export default function Menu({ search, category }) {
	const { setOrderList } = useAppContext();
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

			const matchesCategory = category === 'All' || !category ? true : item.category === category;

			return matchesSearch && matchesCategory;
		});
	}, [data, search, category]);

	const addMenuItem = (name, price) => {
		setOrderList((prev) => {
			// Ensure prev is always treated as an array
			const currentList = Array.isArray(prev) ? prev : [];

			const existingItemIndex = currentList.findIndex((i) => i.item === name);

			if (existingItemIndex > -1) {
				// Update quantity of existing item
				return currentList.map((item, index) =>
					index === existingItemIndex
						? { ...item, quantity: item.quantity + 1, amount: (item.quantity + 1) * price }
						: item
				);
			}

			// Add new item (Immutable append)
			return [...currentList, { item: name, quantity: 1, amount: price }];
		});
	};

	return (
		<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-1 md:gap-2 lg:gap-3 px-2">
			{isLoading
				? Array.from({ length: 12 }).map((_, i) => (
						<div key={i} className="h-51 animate-pulse bg-light w-full text-center"></div>
				  ))
				: filteredMenu.map((menu) => (
						<div key={menu.id} onClick={() => addMenuItem(menu.name, menu.price)}>
							<div className="flex flex-col h-full bg-linear-0 from-98% from-light to-10% to-highlight shadow rounded-sm overflow-hidden cursor-pointer relative active:brightness-90 transition-all select-none">
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
								<div className="grow flex flex-col justify-center">
									<p className="text-sm lg:text-base font-light font-body text-center mt-0.5 px-1 leading-tight tracking-wide">
										{menu.name}
									</p>
								</div>

								{/* Footer section: Stays at the bottom */}
								<div className="mt-auto mb-1">
									<p className="text-center font-bold mb-0.5">₹{menu.price}</p>
									<p className="text-muted text-center text-xs min-h-4 px-1 font-light uppercase">
										{menu.description == null ? 'Normal' : menu.description}
									</p>
								</div>
							</div>
						</div>
				  ))}

			{!isLoading && filteredMenu.length === 0 && (
				<div className="w-full text-center py-10 text-gray-500">No items found matching your criteria.</div>
			)}
		</div>
	);
}
