import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/contact(.*)',
  '/privacy-policy',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/public/courses',
  '/api/uploadthing(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  if (req.nextUrl.pathname.startsWith('/api/uploadthing')) {
    return // Let UploadThing pass through unimpeded
  }

  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
