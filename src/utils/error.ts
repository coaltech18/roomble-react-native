export function getReadableError(error: unknown, fallback = 'Something went wrong') {
  if (!error) return fallback;
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message || fallback;
  if (typeof error === 'object' && error && 'message' in (error as any)) {
    return (error as any).message || fallback;
  }
  return fallback;
}


