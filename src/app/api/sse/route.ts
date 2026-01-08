// app/api/sse/route.ts
import { NextRequest } from 'next/server';
import { redis } from '@/lib/redis';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
        async start(controller) {
            const sendMessage = (eventName: string, data: any) => {
                const message = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
                controller.enqueue(encoder.encode(message));
            };

            const heartbeat = setInterval(() => {
                controller.enqueue(encoder.encode(': heartbeat\n\n'));
            }, 15000);

            let isAborted = false;

            req.signal.addEventListener('abort', () => {
                isAborted = true;
                clearInterval(heartbeat);
                try {
                    controller.close();
                } catch (e) {}
            });

            sendMessage('status', { message: 'Connected to Global Feed' });

            try {
                while (!isAborted) {
                    // Using lpop since brpop isn't supported in the Upstash HTTP SDK
                    const result = await redis.lpop('app_updates');

                    if (result && !isAborted) {
                        // Upstash usually returns the object directly if it was pushed as one
                        const payload = typeof result === 'string' 
                            ? JSON.parse(result) 
                            : result;

                        sendMessage(payload.event, payload.data);
                        
                        // After finding a message, check immediately for the next one
                        continue; 
                    }

                    // If no message, wait a very short time (100ms - 200ms)
                    // This provides near-instant response without hitting rate limits
                    await new Promise((resolve) => setTimeout(resolve, 200));
                }
            } catch (err) {
                console.error("SSE Redis Error:", err);
                if (!isAborted) await new Promise(r => setTimeout(r, 2000));
            }
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