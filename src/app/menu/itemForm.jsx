'use client';

import { useState, useEffect } from 'react';

export default function ItemForm({ initialData = null }) {
    const [isVisible, setIsVisible] = useState(true); // Set to true for visibility or manage via props

    // 1. Define the schema/default state
    const emptyState = {
        category: '',
        description: '',
        img: '',
        isVeg: 0,
        name: '',
        price: '',
    };

    // 2. Initialize state by merging emptyState with initialData
    // This ensures no field is ever 'undefined'
    const [formData, setFormData] = useState({
        ...emptyState,
        ...initialData
    });

    // 3. Determine mode based on the presence of an ID
    const isUpdate = Boolean(formData && formData.id);

    // 4. Sync state if initialData changes (important for Edit modals)
    useEffect(() => {
        if (initialData) {
            setFormData({ ...emptyState, ...initialData });
        } else {
            setFormData(emptyState);
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isUpdate) {
            console.log('Performing UPDATE on ID:', formData.id, formData);
            // Add your update logic / API call here
        } else {
            console.log('Performing INSERT:', formData);
            // Add your insert logic / API call here
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={`${
                isVisible ? 'right-0' : '-right-full'
            } p-4 gap-4 flex flex-col w-full md:w-2/5 bg-light border border-myBorder rounded-sm fixed md:sticky h-[calc(100vh-16px)] md:h-[calc(100vh-52px)] top-2 md:top-13 z-25 md:z-5 transition-all duration-500 shadow-xl`}
        >
            <h2 className="text-xl md:text-3xl font-light text-main text-center uppercase border-b border-myBorder">
                {isUpdate ? `Update Item` : 'Insert New Item'}
            </h2>

            {/* Product Name */}
            <div>
                <label className="block text-sm font-semibold text-muted">Product Name</label>
                <input
                    required
                    type="text"
                    name="name"
                    placeholder="e.g. Green Tea"
                    value={formData.name || ''}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 shadow bg-neutral-500 dark:bg-neutral-600 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>

            {/* Category */}
            <div>
                <label className="block text-sm font-semibold text-muted">Category</label>
                <input
                    type="text"
                    name="category"
                    placeholder="e.g. Beverages"
                    value={formData.category || ''}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 shadow bg-neutral-500 dark:bg-neutral-600 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>

            {/* Price */}
            <div>
                <label className="block text-sm font-semibold text-muted">Price</label>
                <input
                    required
                    type="number"
                    name="price"
                    placeholder="0.00"
                    value={formData.price || ''}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 shadow bg-neutral-500 dark:bg-neutral-600 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-semibold text-muted">Description</label>
                <textarea
                    name="description"
                    placeholder="Describe the item..."
                    value={formData.description || ''}
                    onChange={handleChange}
                    className="w-full mt-1 p-2 shadow bg-neutral-500 dark:bg-neutral-600 rounded-md focus:ring-2 focus:ring-blue-500 outline-none h-24"
                />
            </div>

            {/* IsVeg Checkbox */}
            <div className="flex items-center space-x-3 p-2 rounded-md">
                <input
                    type="checkbox"
                    id="isVeg"
                    name="isVeg"
                    checked={formData.isVeg === 1}
                    onChange={handleChange}
                    className="h-5 w-5 text-green-shadow bg-neutral-500 dark:bg-neutral-600 rounded cursor-pointer"
                />
                <label htmlFor="isVeg" className="text-sm font-medium text-muted cursor-pointer">
                    Vegetarian Item
                </label>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className={`w-full text-white font-bold py-3 px-4 rounded-md transition-all shadow-sm mt-auto ${
                    isUpdate 
                        ? 'bg-orange-600 hover:bg-orange-700 active:scale-95' 
                        : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
                }`}
            >
                {isUpdate ? 'Save Changes' : 'Add to Menu'}
            </button>

            {/* Optional Reset Button for Insert Mode */}
            {!isUpdate && (
                <button 
                    type="button" 
                    onClick={() => setFormData(emptyState)}
                    className="text-xs text-gray-400 hover:text-muted transition-colors"
                >
                    Clear Form
                </button>
            )}
        </form>
    );
}