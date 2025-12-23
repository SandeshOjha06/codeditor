import { handlers } from "@/auth"
export { authOptions } from "@/auth"

// Re-export the request handlers created by `NextAuth` in `auth.ts`.
// `handlers` contains `GET` and `POST` functions; export them directly so
// Next.js calls the actual functions instead of an object.
export const GET = handlers.GET
export const POST = handlers.POST
