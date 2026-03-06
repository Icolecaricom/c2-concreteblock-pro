import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory rate limiting (for production, use Redis)
const rateLimitMap = new Map<string, { count: number; lastRequest: number }>();

// Rate limit configuration
const RATE_LIMITS: Record<string, { windowMs: number; maxRequests: number }> = {
  '/api/chat': { windowMs: 60000, maxRequests: 20 },       // 20 requests per minute
  '/api/contact': { windowMs: 60000, maxRequests: 5 },     // 5 requests per minute
  '/api/plans': { windowMs: 60000, maxRequests: 5 },       // 5 requests per minute
  '/api/quotes': { windowMs: 60000, maxRequests: 10 },     // 10 requests per minute
  '/api/admin': { windowMs: 60000, maxRequests: 10 },      // 10 requests per minute
  'default': { windowMs: 60000, maxRequests: 100 },        // Default: 100 per minute
};

function getRateLimit(pathname: string) {
  for (const [path, config] of Object.entries(RATE_LIMITS)) {
    if (pathname.startsWith(path)) {
      return config;
    }
  }
  return RATE_LIMITS['default'];
}

function checkRateLimit(ip: string, pathname: string): { allowed: boolean; remaining: number } {
  const config = getRateLimit(pathname);
  const key = `${ip}:${pathname}`;
  const now = Date.now();

  const record = rateLimitMap.get(key);

  if (!record || now - record.lastRequest > config.windowMs) {
    rateLimitMap.set(key, { count: 1, lastRequest: now });
    return { allowed: true, remaining: config.maxRequests - 1 };
  }

  if (record.count >= config.maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  record.lastRequest = now;
  return { allowed: true, remaining: config.maxRequests - record.count };
}

// Blocked IPs (for manual blocking of malicious actors)
const BLOCKED_IPS = new Set<string>();

// Suspicious patterns to block
const SUSPICIOUS_PATTERNS = [
  /\.\./,                    // Directory traversal
  /<script/i,               // XSS attempts
  /javascript:/i,           // JavaScript injection
  /on\w+=/i,                // Event handler injection
  /union\s+select/i,        // SQL injection
  /drop\s+table/i,          // SQL injection
  /insert\s+into/i,         // SQL injection
  /delete\s+from/i,         // SQL injection
];

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Get client IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
             request.headers.get('x-real-ip') ||
             'unknown';

  // Block blacklisted IPs
  if (BLOCKED_IPS.has(ip)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // Get the protocol and host
  const protocol = request.headers.get('x-forwarded-proto') || 'http';
  const host = request.headers.get('host') || '';

  // In production, enforce HTTPS
  if (
    process.env.NODE_ENV === 'production' &&
    protocol === 'http' &&
    !host.startsWith('localhost')
  ) {
    const httpsUrl = `https://${host}${request.nextUrl.pathname}${request.nextUrl.search}`;
    return NextResponse.redirect(httpsUrl, 301);
  }

  // Add security headers to response
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // Handle API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    // Check for suspicious patterns in URL and body (for POST requests)
    const url = request.nextUrl.toString();
    const searchParams = request.nextUrl.searchParams.toString();

    for (const pattern of SUSPICIOUS_PATTERNS) {
      if (pattern.test(url) || pattern.test(searchParams)) {
        console.warn(`[Security] Blocked suspicious request from ${ip}: ${url}`);
        return new NextResponse('Bad Request', { status: 400 });
      }
    }

    // Rate limiting
    const { allowed, remaining } = checkRateLimit(ip, request.nextUrl.pathname);
    response.headers.set('X-RateLimit-Remaining', remaining.toString());

    if (!allowed) {
      console.warn(`[Rate Limit] ${ip} exceeded limit for ${request.nextUrl.pathname}`);
      return new NextResponse('Too Many Requests', { status: 429 });
    }

    // CORS for API routes
    const origin = request.headers.get('origin');
    const allowedOrigins = [
      host,
      'localhost:3000',
      'c2concreteblockpro.com',
      'www.c2concreteblockpro.com',
    ].filter(Boolean);

    if (origin) {
      const originHost = origin.replace(/^https?:\/\//, '');
      if (allowedOrigins.some(allowed => originHost === allowed || originHost.endsWith(`.${allowed}`))) {
        response.headers.set('Access-Control-Allow-Origin', origin);
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        response.headers.set('Access-Control-Max-Age', '86400');
        response.headers.set('Access-Control-Allow-Credentials', 'true');
      }
    }

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: response.headers,
      });
    }

    // Log API requests (for monitoring)
    console.log(`[API] ${request.method} ${request.nextUrl.pathname} - ${ip}`);
  }

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/api/admin')) {
    // Admin routes require authentication
    // The actual auth check happens in the API route
    // Here we just add extra logging
    console.log(`[Admin] Access attempt from ${ip} to ${request.nextUrl.pathname}`);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
