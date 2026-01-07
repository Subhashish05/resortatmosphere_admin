'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import NoticeCard from '@/components/noticecard';

// --- Types ---
interface Notice {
    id: number;
    text: string;
    isError: boolean;
}

interface NoticeContextType {
    addNotice: (text: string, isError?: boolean) => void;
}

const NoticeContext = createContext<NoticeContextType | undefined>(undefined);

// --- Provider Component ---
export const NoticeProvider = ({ children }: { children: React.ReactNode }) => {
    const [notices, setNotices] = useState<Notice[]>([]);

    const addNotice = useCallback((text: string, isError = false) => {
        const id = Date.now();
        setNotices((prev) => [...prev, { id, text, isError }]);
    }, []);

    const removeNotice = (id: number) => {
        setNotices((prev) => prev.filter((n) => n.id !== id));
    };

    return (
        <NoticeContext.Provider value={{ addNotice }}>
            {children}
            {/* The Stacking Container */}
            <div className="fixed top-12 right-4 z-99 flex flex-col gap-3 pointer-events-none">
                {notices.map((n) => (
                    <NoticeCard 
                        key={n.id} 
                        notice={n} 
                        onClose={() => removeNotice(n.id)} 
                    />
                ))}
            </div>
        </NoticeContext.Provider>
    );
};

// --- Custom Hook ---
export const useNotice = () => {
    const context = useContext(NoticeContext);
    if (!context) throw new Error('useNotice must be used within a NoticeProvider');
    return context;
};