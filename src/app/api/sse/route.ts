// app/api/sse/route.ts
import { NextRequest } from 'next/server';
import { redis } from '@/lib/redis';

export const runtime = 'edge';

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
                controller.close();
            });

            try {
                while (!isAborted) {
                    // Check Redis for a message
                    const update = await redis.lpop('app_updates');

                    if (update) {
                        // Type casting for safety
                        const { event, data } = update as { event: string; data: any };
                        sendMessage(event, data);
                    } else {
                        // If no message, wait 2 seconds before checking again
                        // This saves API calls and money
                        await new Promise((resolve) => setTimeout(resolve, 2000));
                    }
                }
            } catch (err) {
                console.error("SSE Stream Error:", err);
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