'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { formatOrderDate } from '@/lib/utils';

// fetch function to get only active orders
const fetchActiveOrder = async (page = 1) => {
	try {
		const res = await fetch(`/api/v1/orders?status=active&page=${page}&limit=12`, { cache: 'no-store' });
		if (!res.ok) throw new Error(`Error ${res.status}: Failed to fetch`);
		const json = await res.json();
		return json.data;
	} catch (error) {
		console.error('fetchMenu Error:', error.message);
		return { data: [], totalPages: 1 };
	}
};

export default function ActiveOrders() {
	const router = useRouter();
	const [page, setPage] = useState(1);

	const { data, isLoading } = useQuery({
		queryKey: ['activeOrders', page],
		queryFn: () => fetchActiveOrder(page),
	});

	const orders = data?.orders || [];
	const totalPages = data?.totalPages || 1;

	return (
		<>
			{/* Header / Back Button */}
			<div className="p-4 md:px-10">
				<div className="mb-4">
					<button
						className="flex items-center gap-2 text-sm font-medium hover:text-amber-500 transition-colors"
						onClick={() => router.back()}
					>
						<FaArrowLeft className="text-xs" />
						<span>Back</span>
					</button>
				</div>
			</div>

			<section className="px-2 md:px-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{isLoading ? (
					[...Array(12)].map((_, i) => <div key={i} className="h-32 bg-light animate-pulse rounded-md" />)
				) : orders.length > 0 ? (
					orders.map((order) => {
						// 2. Defensive Parsing
						let orderDetails = { items: [], cartTotal: 0, totalItems: 0 };
						try {
							orderDetails =
								typeof order.order_details === 'string'
									? JSON.parse(order.order_details)
									: order.order_details;
						} catch (e) {
							console.error('Failed to parse order details for ID:', order.id);
						}

						return (
							<div key={order.id} className="px-4 py-2 rounded-md shadow bg-light">
								<div className="text-[10px] flex justify-between items-center mb-2">
									<p className="font-light uppercase">{order.captain_name}</p>
									<p className="font-light uppercase">{formatOrderDate(order.created_at)}</p>
								</div>
								<h2 className="text-2xl text-center mb-1">{order.table_no}</h2>
								<h3 className="font-semibold text-base tracking-wide text-center uppercase flex justify-between">
									<span>{order.fullname}</span>
									{/* 3. Use Optional Chaining */}
									<span>₹{orderDetails?.cartTotal || 0}</span>
								</h3>
								<p className="text-xs text-muted text-center border-b pb-1 mb-2 border-myBorder flex justify-between">
									<span>{order.mobile}</span>
									<span>Items: {orderDetails?.totalItems || 0}</span>
								</p>
								<div className="h-28 overflow-y-auto border-b border-myBorder pb-2 mb-2">
									{orderDetails?.items?.map((list, i) => (
										<div className="flex items-center text-sm font-light" key={i}>
											<p className="grow">{list.item}</p>
											<p className="w-6">{list.quantity}</p>
										</div>
									))}
								</div>
							</div>
						);
					})
				) : (
					<p className="col-span-full text-center py-10 text-muted">No active orders found.</p>
				)}
			</section>
			{/*Pagination Controls */}
			{totalPages > 1 && (
				<div className="mt-8 flex items-center justify-center gap-4">
					<button
						disabled={page === 1}
						onClick={() => setPage((old) => Math.max(old - 1, 1))}
						className="p-2 border rounded-full disabled:opacity-30 hover:bg-gray-100 transition-all"
					>
						<FaChevronLeft />
					</button>

					<span className="text-sm font-medium">
						Page {page} of {totalPages}
					</span>

					<button
						disabled={page >= totalPages}
						onClick={() => setPage((old) => old + 1)}
						className="p-2 border rounded-full disabled:opacity-30 hover:bg-gray-100 transition-all"
					>
						<FaChevronRight />
					</button>
				</div>
			)}
		</>
	);
}
