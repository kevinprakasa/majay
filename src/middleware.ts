// middleware.js
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { headers } = request;
  const authHeader = headers.get('authorization');

  if (!authHeader) {
    const response = NextResponse.rewrite(new URL('/api/auth', request.url));
    response.headers.set('WWW-Authenticate', 'Basic realm="Secure Area"');
    return response;
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString(
    'ascii'
  );
  const [username, password] = credentials.split(':');

  // Check if the credentials are valid
  if (username === 'admin' && password === 'password') {
    return NextResponse.next();
  } else {
    return new Response('Unauthorized', { status: 401 });
  }
}

export const config = {
  matcher: ['/(.*)'], // Apply middleware to all routes
};
