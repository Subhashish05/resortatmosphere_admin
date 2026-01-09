'use client';

import { useMemo } from 'react';
import CategorySkeleton from '@/ui/category';
import { useQuery } from '@tanstack/react-query';
import { FaXmark } from 'react-icons/fa6';

const fetchCategories = async () => {
    const res = await fetch(`/api/category`);
    if (!res.ok) throw new Error('Failed to fetch');
    const json = await res.json();
    return json.data;
};

export default function Category({category, setCategory}) {
    const { data: categories, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
        staleTime: 360 * 1000,
    });

    // Derived State: Sort the array so the selected item is at index 0
    const sortedCategories = useMemo(() => {
        if (!categories) return [];
        if (!category) return categories;

        // Move the selected item to the front
        return [...categories].sort((a, b) => {
            if (a.name === category) return -1;
            if (b.name === category) return 1;
            return 0;
        });
    }, [categories, category]);

    const toggleCategory = (name) => {
        setCategory(prev => prev === name ? '' : name);
    };

    return (
        <section className="sticky top-26 z-1 bg-dark pb-1">
            <div className="flex flex-nowrap items-center min-h-8 md:mx-3 py-2 gap-2 overflow-x-scroll scroll-smooth">
                {isLoading ? (
                    <CategorySkeleton />
                ) : (
                    sortedCategories.map((cat) => (
                        <div
                            key={cat.id}
                            className={`text-sm lg:text-base mx-1 category_card ${category === cat.name ? 'current_category' : ''}`}
                            onClick={() => toggleCategory(cat.name)}
                        >
                            {cat.name}
                            {category === cat.name && <FaXmark className="ml-1 size-5" />}
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}