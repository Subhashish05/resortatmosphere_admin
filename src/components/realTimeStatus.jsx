'use client';

import { useEffect, useState } from 'react';

export default function RealTimeStatus() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const eventSource = new EventSource('/api/sse');

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prev) => [...prev, data]);
        };

        eventSource.onerror = (err) => {
            console.error('SSE connection failed:', err);
            eventSource.close();
        };

        return () => {
            eventSource.close(); // Important: Close connection on unmount
        };
    }, []);

    return (
        <div>
            <h2>Server Updates:</h2>
            <ul>
                {messages.map((m, i) => (
                    <li key={i}>{m.time || m.message}</li>
                ))}
            </ul>
        </div>
    );
}