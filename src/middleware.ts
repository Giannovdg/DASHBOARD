import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(request: NextRequest) {
  try {
    // Create a Supabase client configured to use cookies
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req: request, res });
    
    // Refresh session if expired - required for Server Components
    await supabase.auth.getSession();
    
    return res;
  } catch (e) {
    // If there's an error, let the request through anyway
    console.error("Middleware error:", e);
    return NextResponse.next();
  }
}

// Only run this middleware on auth-related routes
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}; 