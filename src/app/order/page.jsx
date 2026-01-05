'use client';

import { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import Category from './category';
import Menu from './menu';
import Cart from './cart';
import { BsCartXFill } from 'react-icons/bs';

export default function OrderPage() {
	const [search, setSearch] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');
	const [orderList, setOrderList] = useState([]); // {item: '', quantity: 1, amount: }

	return (
		<section className="flex justify-center items-start min-h-[calc(100vh-48px)]">
			{/* menu area */}
			<section className="w-full md:w-3/5 h-full relative">
				<div className="sticky px-2 top-12 z-10 bg-mid flex justify-between items-center">
					<div className="relative grow mr-6">
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
							className="placeholder:font-light w-full h-8 my-3 rounded-4xl bg-linear-0 from-98% from-light to-10% to-highlight shadow pl-8 pr-2 outline-none"
						/>
					</div>
					<button onClick={()=>setOrderList([])} className="h-8 my-3 px-6 rounded-4xl bg-linear-0 from-98% from-red-500 to-10% to-red-400 text-white text-sm lg:text-base shadow text-center flex items-center font-light">
						<BsCartXFill className='size-4 mr-1'/>
						Clear Cart
					</button>
				</div>
				<Category category={selectedCategory} setCategory={setSelectedCategory} />
				<Menu search={search} category={selectedCategory} setOrderList={setOrderList} />
			</section>

			{/* Cart area */}
			<section className="w-full md:w-2/5 border border-myBorder rounded-sm md:sticky h-[calc(100vh-52px)] md:top-13 flex flex-col">
				<Cart orderList={orderList} setOrderList={setOrderList} />
			</section>
		</section>
	);
}
