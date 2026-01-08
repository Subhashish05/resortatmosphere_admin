'use client';

import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import OrderCard from './orderCard';

// fetch function to get only active orders
const fetchActiveOrder = async (page = 1) => {
	try {
		const res = await fetch(`/api/orders?status=active&page=${page}&limit=12`);
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
	const queryClient = useQueryClient();

	const { data, isLoading } = useQuery({
		queryKey: ['activeOrders', page],
		queryFn: () => fetchActiveOrder(page),
		staleTime: 60 * 100,
	});

	useEffect(() => {
		const eventSource = new EventSource('/api/sse');

		eventSource.addEventListener('order_update', (event) => {
			console.log('Real-time update received from Redis via SSE:', event.data);
			queryClient.invalidateQueries({ queryKey: ['activeOrders'] });
		});

		eventSource.onerror = (error) => {
			console.error('SSE Connection Error:', error);
			eventSource.close();
		};

		return () => eventSource.close();
	}, [queryClient]);

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

			<section className="px-2 md:px-10 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{isLoading ? (
					[...Array(12)].map((_, i) => <div key={i} className="h-82 bg-light animate-pulse rounded-md" />)
				) : orders.length > 0 ? (
					orders.map((order) => <OrderCard order={order} key={order.id} />)
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
