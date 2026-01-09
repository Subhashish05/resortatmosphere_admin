'use client';

import { FaXmark } from 'react-icons/fa6';
import { useCallback, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// --- The Animated Card Component ---
export default function NoticeCard({ notice, onClose }) {
    const containerRef = useRef(null);
    const progressRef = useRef(null);

    const handleDismiss = useCallback(() => {
        gsap.to(containerRef.current, {
            x: 100,
            opacity: 0,
            duration: 0.4,
            ease: 'power2.in',
            onComplete: onClose
        });
    }, [onClose]);

    useGSAP(() => {
        const tl = gsap.timeline();
        tl.fromTo(containerRef.current, 
            { x: 100, opacity: 0 }, 
            { x: 0, opacity: 1, duration: 0.35, ease: 'power3.out' }
        );
        tl.fromTo(progressRef.current, 
            { width: '0%' }, 
            { width: '100%', duration: 2.5, ease: 'none', onComplete: handleDismiss }
        );
    }, { scope: containerRef });

    return (
        <section
            ref={containerRef}
            className={`pointer-events-auto relative px-4 py-2 w-80 rounded-md shadow-xl border backdrop-blur-md
                ${notice.isError ? 'bg-red-50/90 text-red-700 border-red-200' : 'bg-emerald-50/90 text-emerald-700 border-emerald-200'}`}
        >
            <div className="flex justify-between items-start gap-2">
                <p className="text-sm font-semibold leading-snug">{notice.text}</p>
                <button onClick={handleDismiss} className="mt-0.5 hover:scale-110 transition-transform">
                    <FaXmark />
                </button>
            </div>
            <span ref={progressRef} className={`absolute bottom-0 left-0 h-0.5 rounded-b-md ${notice.isError ? 'bg-red-500' : 'bg-emerald-500'}`} />
        </section>
    );
}