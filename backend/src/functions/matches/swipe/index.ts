import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { z } from 'zod';

const bodySchema = z.object({
  targetUserId: z.string().min(1),
  action: z.enum(['like', 'nope', 'super'])
});

export async function swipeHandler(req: HttpRequest, ctx: InvocationContext): Promise<HttpResponseInit> {
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) return { status: 400, jsonBody: { message: 'Invalid request' } };
    // TODO: write to Cosmos DB and return match status
    return { status: 200, jsonBody: { status: 'ok' } };
  } catch (e: any) {
    ctx.error('swipe error', e);
    return { status: 500, jsonBody: { message: 'Server error' } };
  }
}

app.http('swipe', {
  methods: ['POST'],
  route: 'matches/swipe',
  authLevel: 'anonymous',
  handler: swipeHandler
});


