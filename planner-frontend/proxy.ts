import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
    const token = request.cookies.get('better-auth.session_token')?.value
    const { pathname } = request.nextUrl

    // Define paths
    const protectedPaths = ['/dashboard']
    const authPaths = ['/login', '/register']

    // Check if path is protected
    const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
    const isAuthPath = authPaths.some(path => pathname.startsWith(path))

    // Redirect to login if accessing protected path without session token
    if (isProtectedPath && !token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Redirect to dashboard if accessing auth path with session token
    if (isAuthPath && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
