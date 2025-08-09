import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2),
  age: z.number().min(18).max(65).optional(),
  occupation: z.string().min(2).optional()
});

export async function updateProfileHandler(
  req: HttpRequest,
  ctx: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const json = await req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) return { status: 400, jsonBody: { message: 'Invalid request' } };
    // TODO: persist to Cosmos DB
    return { status: 200, jsonBody: { ok: true } };
  } catch (e: any) {
    ctx.error('profile update error', e);
    return { status: 500, jsonBody: { message: 'Server error' } };
  }
}

app.http('profile-update', {
  methods: ['PUT'],
  route: 'profile/update',
  authLevel: 'anonymous',
  handler: updateProfileHandler
});


