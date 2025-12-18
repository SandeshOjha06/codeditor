import { db } from "@/src/db";
import { users } from "@/src/db/schema";

export async function GET() {
    const user = await db.select().from(users)
    return new Response(JSON.stringify(user))
    
}