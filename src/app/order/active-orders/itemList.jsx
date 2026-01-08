import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { HiOutlineXMark } from 'react-icons/hi2';

export default function ItemList({ id, order_details, setShowItemList }) {
	const queryClient = useQueryClient();
	const [buttonText, setButtonText] = useState('Submit');
	const [list, setList] = useState(order_details.items);

	const cartTotal = order_details.cartTotal;
	const totalItems = order_details.totalItems;

	const handleServe = (name, i) => {
		setList((prev) => prev.map((obj) => (obj.item == name ? { ...obj, isServed: !list[i].isServed } : obj)));
	};

	const handleSubmit = async () => {
		setButtonText('Submitting');

		const payload = {
			id: id,
			order_details: { items: list, cartTotal, totalItems },
		};
		try {
			const response = await fetch('/api/orders', {
				method: 'PATCH',
				headers: { 'Content-Type': 'applicaton/json' },
				body: JSON.stringify(payload),
			});
			if (response.ok) {
				queryClient.invalidateQueries({queryKey: ['activeOrders']})
				setButtonText('Submit');
				setShowItemList(false);
			}
		} catch (error) {
			console.error(error);
			setButtonText('Submit');
		}
	};

	return (
		<>
			<div className="fixed top-0 left-0 bg-black/15 backdrop-blur-sm z-100 flex justify-center items-center w-screen h-screen">
				<div className="w-75 p-2 bg-light min-h-100 flex flex-col relative pt-4">
					<button
						type="button"
						className="absolute top-1 right-1 text-red-500 flex justify-center items-center size-8"
						onClick={() => setShowItemList(false)}
					>
						<HiOutlineXMark size={20} />
					</button>
					<h2 className="text-lg md:text-2xl text-center border-b border-myBorder mb-3">Item List</h2>
					<div className="grow">
						{list.map((item, i) => {
							const uniqueId = `order-${id}-item-${i}`;

							return (
								<label
									key={uniqueId}
									htmlFor={uniqueId}
									className="text-sm font-light flex items-center pb-2 cursor-pointer select-none"
								>
									<input
										type="checkbox"
										id={uniqueId}
										className="peer"
										checked={list[i].isServed}
										disabled={order_details.items[i].isServed}
										onChange={() => handleServe(item.item, i)}
									/>
									<span className="ml-1 peer-checked:line-through peer-checked:text-muted">
										{item.item} (x{item.quantity})
									</span>
								</label>
							);
						})}
					</div>
					<div className="text-center">
						<button
							type="button"
							onClick={() => handleSubmit()}
							className="w-[calc(100%-0.5rem)] mb-2 rounded-sm shadow bg-emerald-600 py-1 font-normal active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
						>
							{buttonText}
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
