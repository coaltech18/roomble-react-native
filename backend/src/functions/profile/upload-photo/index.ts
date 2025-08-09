import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { BlobServiceClient } from '@azure/storage-blob';

export async function uploadPhoto(
  req: HttpRequest,
  ctx: InvocationContext
): Promise<HttpResponseInit> {
  try {
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return { status: 400, jsonBody: { message: 'Invalid content type' } };
    }
    // Simplified placeholder: in production, parse multipart form-data
    // Here we just return a mock URL for scaffold
    return { status: 200, jsonBody: { url: 'https://example.com/photo.jpg' } };
  } catch (e: any) {
    ctx.error('upload-photo error', e);
    return { status: 500, jsonBody: { message: 'Server error' } };
  }
}

app.http('upload-photo', {
  methods: ['POST'],
  route: 'profile/upload-photo',
  authLevel: 'anonymous',
  handler: uploadPhoto
});


