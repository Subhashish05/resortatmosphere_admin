import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

const fetchActiveOrderCount = async () => {
	try {
		const res = await fetch(`/api/orders/total`);

		if (!res.ok) {
			console.error('Fail to fetch data, Error:', res.status);
			return 0;
		}
		const json = await res.json();
		return json.data;
	} catch (error) {
		console.error(error);
		return 0;
	}
};

export default function ActiveOrderCount() {
	const queryClient = useQueryClient();

	const { data, isLoading } = useQuery({
		queryKey: ['activeOrderList'],
		queryFn: fetchActiveOrderCount,
		staleTime: 60 * 1000,
	});

	useEffect(() => {
		const eventSource = new EventSource('/api/sse');

		eventSource.addEventListener('order_update', (event) => {
			console.log('Real-time update received from Redis via SSE:', event.data);
			queryClient.invalidateQueries({ queryKey: ['activeOrderList'] });
		});

		eventSource.onerror = (error) => {
			console.error('SSE Connection Error:', error);
			eventSource.close();
		};

		return () => eventSource.close();
	}, [queryClient]);

	return (
		<div className="flex items-center justify-center">
			<p>Active Orders</p>
			<div className="flex justify-center items-center w-8">
				{isLoading ? (
					<span className="border-2 border-black border-t-transparent rounded-full animate-spin size-4"></span>
				) : (
					<span>({data})</span>
				)}
			</div>
		</div>
	);
}
