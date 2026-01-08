'use client';

import { useState } from 'react';
import { formatOrderDate } from '@/lib/utils';
import ItemList from './itemList';

export default function OrderCard({ order }) {
	const [showItemList, setShowItemList] = useState(false);
	
	const ChangeStatus = () => {
		setShowItemList(true);
	};

	const PrintBill = () => {};
	const AddMoreItems = (order) => {
		console.log(order);
	};
	return (
        <>
            <div className="px-4 py-2 rounded-md shadow bg-light">
                <div className="text-[10px] flex justify-between items-center mb-2">
                    <p className="font-light uppercase">{order.captain_name}</p>
                    <p className="font-light uppercase">{formatOrderDate(order.created_at)}</p>
                </div>
                <h2 className="text-2xl text-center mb-1">{order.table_no}</h2>
                <h3 className="font-semibold text-base tracking-wide text-center uppercase flex justify-between">
                    <span>{order.fullname}</span>
                    <span>₹{order.order_details.cartTotal || 0}</span>
                </h3>
                <p className="text-xs text-muted text-center border-b pb-1 mb-2 border-myBorder flex justify-between">
                    <span>{order.mobile}</span>
                    <span>Items: {order.order_details?.totalItems || 0}</span>
                </p>
                <div className="h-28 overflow-y-auto border-b border-myBorder pb-2 mb-2">
                    {order.order_details?.items.map((list, i) => (
                        <div
                            className={`flex items-center text-sm ${list.isServed ? 'text-muted' : 'text-main'}`}
                            key={i}
                        >
                            <p className="grow">{list.item}</p>
                            <p className="w-6">{list.quantity}</p>
                        </div>
                    ))}
                </div>
                <div className="flex flex-wrap justify-between item-center text-neutral-100">
                    <button
                        type="button"
                        className="w-full mb-2 rounded-sm shadow bg-red-500 py-1 font-light active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        onClick={ChangeStatus}
                    >
                        Pending
                    </button>
                    <button
                        type="button"
                        className="w-[calc(50%-0.5rem)] mb-2 rounded-sm shadow bg-emerald-600 py-1 font-light active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        onClick={() => AddMoreItems(order)}
                    >
                        Add Items
                    </button>
                    <button
                        type="button"
                        className="w-[calc(50%-0.5rem)] mb-2 rounded-sm shadow bg-blue-600 py-1 font-light active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        onCanPlay={PrintBill}
                    >
                        Payment
                    </button>
                </div>
            </div>

            {showItemList && <ItemList id={order.id} order_details={order.order_details} setShowItemList={setShowItemList}/>}
        </>
	);
}