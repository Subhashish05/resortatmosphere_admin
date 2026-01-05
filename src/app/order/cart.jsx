import Link from 'next/link';
import { FaClipboardCheck, FaClipboardList, FaMinus, FaPlus } from 'react-icons/fa6';

export default function Cart({ orderList, setOrderList }) {
	// Add quantity to an existing item
	const addItem = (itemName) => {
		setOrderList((prev) =>
			prev.map((item) => (item.item === itemName ? { ...item, quantity: item.quantity + 1 } : item))
		);
	};

	// Remove quantity or delete item if quantity is 1
	const removeItem = (itemName) => {
		setOrderList((prev) =>
			prev.reduce((acc, item) => {
				if (item.item === itemName) {
					if (item.quantity > 1) {
						// Decrease quantity
						acc.push({ ...item, quantity: item.quantity - 1 });
					}
					// If quantity is 1, we don't push it back (removes it from list)
				} else {
					acc.push(item);
				}
				return acc;
			}, [])
		);
	};

	// Derived State: Calculate totals automatically on every render
	const totalItems = orderList.reduce((acc, item) => acc + item.quantity, 0);
	const cartTotal = orderList.reduce((acc, item) => acc + item.quantity * item.amount, 0);

	return (
		<>
			<div className="flex justify-between items-center">
				<div className="w-1/2">
					<Link
						href={'/order/active-orders'}
						className="flex justify-center items-center gap-2 m-2 px-2 py-1 bg-emerald-500 rounded-sm shadow text-sm lg:text-base text-center text-black"
					>
						<FaClipboardList /> Active Orders
					</Link>
				</div>
				<div className="w-1/2">
					<Link
						href={'/order/all-orders'}
						className="flex justify-center items-center gap-2 m-2 px-2 py-1 bg-light rounded-sm shadow text-sm lg:text-base text-center"
					>
						<FaClipboardCheck /> All Orders
					</Link>
				</div>
			</div>

			<div className="mt-2 grow overflow-y-scroll select-none">
				<table className="w-full border-collapse">
					<thead>
						<tr className="bg-amber-500/25 text-sm lg:text-base">
							<th className="font-light text-left p-2">Items</th>
							<th className="font-light text-center w-20 p-2">QTY</th>
							<th className="font-light text-right w-24 p-2">Amount</th>
						</tr>
					</thead>
					<tbody>
						{orderList.map((list, i) => (
							<tr key={list.item} className="border-b border-myBorder h-10 text-sm">
								<td className="pl-2 font-light">{list.item}</td>
								<td className="text-center">
									<div className="flex items-center justify-center gap-2">
										<button
											className="flex justify-center items-center w-6 h-6 rounded-full active:scale-90 transition-transform"
											onClick={() => removeItem(list.item)}
										>
											<FaMinus />
										</button>
										<span className="w-5 text-sm text-center">{list.quantity}</span>
										<button
											className="flex justify-center items-center w-6 h-6 rounded-full active:scale-90 transition-transform"
											onClick={() => addItem(list.item)}
										>
											<FaPlus />
										</button>
									</div>
								</td>
								<td className="text-right pr-2">₹{(list.quantity * list.amount).toFixed(2)}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<div className="text-xs text-muted px-2 mt-4">
				<p className="border-b border-myBorder pb-1 flex justify-between">
					<span>Total Items:</span>
					<span>{totalItems}</span>
				</p>
				<p className="border-b border-myBorder pb-1 pt-1 flex justify-between">
					<span>Cart Total:</span>
					<span>₹{cartTotal.toFixed(2)}</span>
				</p>
				<p className="text-sm text-main pt-1 flex justify-between">
					<span>Total Payable</span>
					<span className="font-bold">₹{cartTotal.toFixed(2)}</span>
				</p>
			</div>

			<button
				disabled={orderList.length === 0}
				className="w-[calc(100%-1rem)] m-2 px-2 py-2 rounded-sm shadow text-sm lg:text-base text-center bg-amber-500 text-black font-medium active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
			>
				Place Order
			</button>
		</>
	);
}
