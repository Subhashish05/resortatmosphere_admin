import { useAppContext } from '@/context/context';
import { useNotice } from '@/context/noticeContext';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { FaClipboardCheck, FaClipboardList, FaMinus, FaPlus } from 'react-icons/fa6';
import { HiOutlineXMark } from 'react-icons/hi2';
import ActiveOrderCount from './activeOrderCount';
import { useQueryClient } from '@tanstack/react-query';

export default function Cart() {
	const { userContext, orderList, setOrderList } = useAppContext();
	const { addNotice } = useNotice();
	const queryClient = useQueryClient();

	const [isVisible, setIsVisible] = useState(false);

	// order details
	const [fullName, setFullName] = useState('');
	const [mobileNumber, setMobileNumber] = useState('');
	const [tableNumber, setTableNumber] = useState('');
	const [kotRemarks, setKotRemarks] = useState('');
	const [billRemarks, setBillRemarks] = useState('');

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

	const handlePlaceOrder = async () => {
		const orderDetails = {
			items: orderList,
			totalItems,
			cartTotal,
		};

		const payload = {
			fullname: fullName,
			mobile: mobileNumber,
			table_no: tableNumber,
			kot_remark: kotRemarks,
			bill_remark: billRemarks,
			order_details: orderDetails,
			captain_name: userContext.name,
			status: 'active',
		};

		try {
			const response = await fetch('/api/orders', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});

			if (response.ok) {
				addNotice('Order placed successfully!');

				queryClient.invalidateQueries(['activeOrderList']);
				setIsVisible(false);

				// Clear the form and list
				setOrderList([]);
				setFullName('');
				setMobileNumber('');
				setTableNumber('');
				setKotRemarks('');
				setBillRemarks('');
			}
		} catch (error) {
			addNotice('Failed to place order', true);
		}
	};

	return (
		<>
			<section
				className={`${
					isVisible ? 'flex' : 'hidden'
				} md:flex flex-col w-full md:w-2/5 bg-mid border border-myBorder rounded-sm fixed md:sticky h-[calc(100vh-16px)] md:h-[calc(100vh-52px)] top-2 md:top-13 right-0 z-25 md:5`}
			>
				<div className="relative py-1 border-b border-myBorder md:hidden">
					<h2 className="text-xl md:text-3xl text-center">Order Cart</h2>
					<button
						type="button"
						className="absolute top-0.5 right-1 text-red-500 flex justify-center items-center size-8"
						onClick={() => setIsVisible(false)}
					>
						<HiOutlineXMark size={24} />
					</button>
				</div>
				<div className="flex justify-between items-center my-2">
					<div className="w-1/2">
						<Link
							href={'/order/active-orders'}
							className="flex justify-center items-center gap-1 m-2 px-2 py-1 bg-emerald-500 rounded-sm shadow text-sm lg:text-base text-center text-black active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
						>
							<FaClipboardList /> <ActiveOrderCount />
						</Link>
					</div>
					<div className="w-1/2">
						<Link
							href={'/order/all-orders'}
							className="flex justify-center items-center gap-2 m-2 px-2 py-1 bg-main text-dark rounded-sm shadow text-sm lg:text-base text-center active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
						>
							<FaClipboardCheck /> All Orders
						</Link>
					</div>
				</div>

				<div className="mt-2 grow overflow-y-scroll select-none bg-light">
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
									<td className="pl-2 font-normal">{list.item}</td>
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

				{/* Trigger Button */}
				<div className="flex justify-around">
					<button
						popoverTarget="confirmOrder"
						className="w-[calc(100%-1rem)] m-2 px-2 py-2 rounded-sm shadow text-sm lg:text-base text-center bg-blue-500 text-white font-medium active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
					>
						Place Order
					</button>
					<button
						popoverTarget="confirmOrder"
						className="w-[calc(100%-1rem)] m-2 px-2 py-2 rounded-sm shadow text-sm lg:text-base text-center bg-blue-500 text-white font-medium active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
					>
						Print Bill
					</button>
				</div>

				{/* Popover Content */}
				<section
					id="confirmOrder"
					popover="auto"
					className="m-auto p-4 bg-light text-main rounded-lg shadow-xl backdrop:bg-black/50 backdrop:backdrop-blur-xs fixed top-0 left-0"
				>
					<button
						type="button"
						popoverTarget="confirmOrder"
						popoverTargetAction="hide"
						className="absolute top-1 right-1 text-red-500 flex justify-center items-center size-8"
					>
						<HiOutlineXMark size={20} />
					</button>
					<div className="flex flex-col gap-4 w-75">
						<h2 className="text-xl font-bold border-b border-myBorder text-center pb-2">Confirm Order</h2>
						<div>
							<h3 className="font-light mb-1">Customer Details</h3>
							<div className="relative mb-3">
								<input
									type="text"
									name="full_name"
									id="full_name"
									placeholder=""
									className="peer border border-theme p-2 rounded-sm outline-0 w-full"
									value={fullName}
									onChange={(e) => setFullName(e.target.value)}
								/>
								<label
									htmlFor="full_name"
									className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-muted transition-all pointer-events-none peer-focus:top-0.5 peer-focus:text-xs peer-focus:text-amber-600 peer-focus:bg-light peer-[:not(:placeholder-shown)]:top-0.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-light px-0.5"
								>
									Full Name
								</label>
							</div>
							<div className="relative mb-3">
								<input
									type="tel"
									inputMode="numeric"
									pattern="[0-9]*"
									name="mobile_number"
									id="mobile_number"
									placeholder=" "
									className="peer border border-theme p-2 rounded-sm outline-0 w-full"
									value={mobileNumber}
									onChange={(e) => {
										const val = e.target.value.replace(/\D/g, '');
										setMobileNumber(val);
									}}
								/>
								<label
									htmlFor="mobile_number"
									className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-muted transition-all pointer-events-none peer-focus:top-0.5 peer-focus:text-xs peer-focus:text-amber-600 peer-focus:bg-light peer-[:not(:placeholder-shown)]:top-0.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-light px-0.5"
								>
									Mobile No
								</label>
							</div>
							<TableInput tableNumber={tableNumber} setTableNumber={setTableNumber} />
							<div className="relative mb-3">
								<input
									type="text"
									name="kot_remarks"
									id="kot_remarks"
									placeholder=""
									className="peer border border-theme p-2 rounded-sm outline-0 w-full"
									value={kotRemarks}
									onChange={(e) => setKotRemarks(e.target.value)}
								/>
								<label
									htmlFor="kot_remarks"
									className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-muted transition-all pointer-events-none peer-focus:top-0.5 peer-focus:text-xs peer-focus:text-amber-600 peer-focus:bg-light peer-[:not(:placeholder-shown)]:top-0.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-light px-0.5"
								>
									KOT Remarks
								</label>
							</div>
							<div className="relative">
								<input
									type="text"
									name="bill_remarks"
									id="bill_remarks"
									placeholder=""
									className="peer border border-theme p-2 rounded-sm outline-0 w-full"
									value={billRemarks}
									onChange={(e) => setBillRemarks(e.target.value)}
								/>
								<label
									htmlFor="bill_remarks"
									className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-muted transition-all pointer-events-none peer-focus:top-0.5 peer-focus:text-xs peer-focus:text-amber-600 peer-focus:bg-light peer-[:not(:placeholder-shown)]:top-0.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-light px-0.5"
								>
									Bill Remarks
								</label>
							</div>
						</div>
						<p className="text-sm text-main py-2 border-t border-b border-myBorder flex justify-between">
							<span>To Be Paid</span>
							<span className="font-bold">₹{cartTotal.toFixed(2)}</span>
						</p>
						<div className="flex justify-around gap-2 text-white">
							<button
								className="w-2/5 px-4 py-2 bg-red-600 rounded"
								onClick={() => {
									setFullName('');
									setMobileNumber('');
									setTableNumber('');
									setKotRemarks('');
									setBillRemarks('');
								}}
							>
								Reset
							</button>
							<button
								onClick={handlePlaceOrder}
								popoverTarget="confirmOrder"
								popoverTargetAction="hide"
								className="w-2/5 px-4 py-2 bg-green-600 rounded"
							>
								Confirm
							</button>
						</div>
					</div>
				</section>
			</section>

			<div className="flex items-center justify-between md:hidden fixed bottom-0 left-0 py-4 px-3 bg-light z-3 w-full gap-4">
				<div className="flex items-center justify-center">
					<p className="text-2xl md:text-4xl">TOTAL :</p>
					<div className="text-center ml-3 w-20">
						<p className="text-right">₹ {cartTotal}</p>
						<p className="text-xs font-light text-muted">Total Item: {totalItems}</p>
					</div>
				</div>
				<button
					type="button"
					className="bg-main text-dark px-5 py-2 rounded-full shadow"
					onClick={() => setIsVisible(true)}
				>
					View Cart
				</button>
			</div>
		</>
	);
}

const tables = [
	'Table 01',
	'Table 02',
	'Table 03',
	'Table 04',
	'Table 05',
	'Table 06',
	'Table 07',
	'Table 08',
	'Table 09',
	'Table 10',
	'Room 101',
	'Room 102',
	'Room 104',
	'Room 105',
	'Room 107',
	'Room 108',
	'Room 110',
	'Room 111',
	'Room 201',
	'Room 202',
	'Room 203',
	'Room 204',
	'Room 205',
	'Room 206',
	'Room 207',
	'Room 208',
	'Room 209',
	'Room 210',
	'Room 211',
	'Room 212',
	'Room 214',
	'Room 301',
	'Room 302',
	'Room 303',
	'Room 304',
	'Room 305',
	'Room 306',
	'Room 307',
	'Room 308',
	'Room 309',
	'Room 310',
	'Room 311',
	'Room 312',
	'Tent 01',
	'Tent 02',
	'Tent 03',
	'Tent 04',
	'Tent 05',
	'Tent 06',
	'Tent 07',
	'Tent 08',
	'Tent 09',
	'DGH 101',
	'DGH 102',
	'DGH 103',
	'DGH 104',
	'DGH 105',
	'DGH 106',
	'DGH 107',
	'DGH 108',
	'DGH 109',
	'DGH 110',
];

function TableInput({ tableNumber, setTableNumber }) {
	const [showSuggestions, setShowSuggestions] = useState(false);
	const containerRef = useRef(null);

	// Mock data - replace with your actual table list

	// Filter logic
	const filteredSuggestions = tables.filter(
		(table) =>
			table.toLowerCase().includes(tableNumber.toLowerCase()) &&
			tableNumber.length > 0 &&
			table.toLowerCase() !== tableNumber.toLowerCase()
	);

	// Close suggestions when clicking outside
	useEffect(() => {
		const handleClickOutside = (e) => {
			if (containerRef.current && !containerRef.current.contains(e.target)) {
				setShowSuggestions(false);
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	return (
		<div className="relative w-full mb-3" ref={containerRef}>
			<input
				type="text"
				name="table_number"
				id="table_number"
				autoComplete="off"
				placeholder=" "
				className="peer border border-theme p-2 rounded-sm outline-0 w-full bg-transparent relative"
				value={tableNumber}
				onFocus={() => setShowSuggestions(true)}
				onChange={(e) => {
					setTableNumber(e.target.value);
					setShowSuggestions(true);
				}}
			/>
			<label
				htmlFor="table_number"
				className="
					absolute left-2 top-1/2 -translate-y-1/2 text-sm text-muted transition-all pointer-events-none z-8 
					peer-focus:top-0.5 peer-focus:text-xs peer-focus:text-amber-600 peer-focus:bg-light	 
					peer-[:not(:placeholder-shown)]:top-0.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:bg-light px-0.5"
			>
				Table Number
			</label>

			{/* Google-style Suggestion Box */}
			{showSuggestions && filteredSuggestions.length > 0 && (
				<ul className="absolute left-0 right-0 top-full bg-light border border-t-0 border-mid shadow rounded-b-sm z-10 max-h-48 overflow-y-auto">
					{filteredSuggestions.map((suggestion, index) => (
						<li
							key={index}
							className="px-3 py-2 text-sm hover:bg-black/10 cursor-pointer font-light"
							onClick={() => {
								setTableNumber(suggestion);
								setShowSuggestions(false);
							}}
						>
							<span>{suggestion}</span>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
