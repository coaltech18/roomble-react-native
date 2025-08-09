import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { z } from 'zod';

const bodySchema = z.object({ phone: z.string().regex(/^\d{10}$/), otp: z.string().min(4).max(6) });

export async function verifyOtpHandler(req: HttpRequest, ctx: InvocationContext): Promise<HttpResponseInit> {
  try {
    const json = await req.json();
    const parsed = bodySchema.safeParse(json);
    if (!parsed.success) {
      return { status: 400, jsonBody: { message: 'Invalid request' } };
    }
    const { phone } = parsed.data;
    // TODO: Integrate with Azure AD B2C OTP verification
    const fakeUserId = `user_${phone}`;
    const fakeToken = `token_${Date.now()}`;
    return { status: 200, jsonBody: { userId: fakeUserId, token: fakeToken } };
  } catch (e: any) {
    ctx.error('verify-otp error', e);
    return { status: 500, jsonBody: { message: 'Server error' } };
  }
}

app.http('verify-otp', {
  methods: ['POST'],
  route: 'auth/verify-otp',
  authLevel: 'anonymous',
  handler: verifyOtpHandler
});


