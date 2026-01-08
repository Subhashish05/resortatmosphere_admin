import { NextRequest } from 'next/server';
import { eventBus } from '@/lib/events';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        start(controller) {
            const sendMessage = (eventName: string, data: any) => {
                const message = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
                controller.enqueue(encoder.encode(message));
            };

            // Define listeners
            const onOrderUpdate = (data: any) => sendMessage('order_update', data);
            const onContactUpdate = (data: any) => sendMessage('contact_update', data);

            // Subscribe to the bus
            eventBus.on('ORDER_CHANGED', onOrderUpdate);
            eventBus.on('CONTACT_CHANGED', onContactUpdate);

            // Initial message
            sendMessage('status', { message: 'Connected to Live Feed' });

            // Cleanup: remove listeners when client disconnects
            req.signal.addEventListener('abort', () => {
                eventBus.off('ORDER_CHANGED', onOrderUpdate);
                eventBus.off('CONTACT_CHANGED', onContactUpdate);
                controller.close();
            });
        },
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no',
        },
    });
}