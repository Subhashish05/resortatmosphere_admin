'use client';

import { useEffect, useState, useRef } from 'react';

export default function NoticeCard({ isError, notice }) {
    // This state starts as 'false' every single time a new key is provided
    const [isDismissed, setIsDismissed] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        if (!notice) return;

        // No need to setIsDismissed(false) here! 
        // React handled the reset because the 'key' changed.

        timerRef.current = setTimeout(() => {
            setIsDismissed(true);
        }, 5000);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [notice]); // Re-run timer if notice changes

    const isVisible = Boolean(notice) && !isDismissed;

    if (!notice) return null;

    return (
        <section
            role="alert"
            className={`rounded-sm flex items-center justify-center p-6 py-3 w-80 fixed top-16 z-30 
                ${isVisible ? 'right-0' : '-right-80'}
                ${isError ? 'bg-red-200 text-red-600' : 'bg-emerald-50 text-emerald-600'}
                transition-[right] duration-300`}
        >
            <p className="w-11/12 text-sm">{notice}</p>
            <button
                type="button"
                className="bi bi-x-lg w-1/12"
                onClick={() => setIsDismissed(true)}
                aria-label="Close notice"
            ></button>

            <span
                className={`absolute ${isError ? 'bg-red-600' : 'bg-emerald-600'} bottom-0 left-0 h-0.5 
                    ${isVisible ? 'w-full' : 'w-0'} 
                    transition-[width] duration-5000 ease-linear`}
            ></span>
        </section>
    );
}