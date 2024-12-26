import { eq } from "drizzle-orm";
import { acc_db } from "~/drizzle";
import { users } from "~/drizzle/acc_schema";
import { fetchUserInfo, initOAuthConfig } from "~/utils/auth";

export default defineEventHandler(async (event) => {
    //parse the Authorization header

    const auth_header = event.headers.get('Authorization')

    if (!auth_header) {
        throw createError({
            statusCode: 401,
            message: 'Authorization header not found'
        })
    }

    //remove the Bearer prefix
    const token = auth_header.split(' ')[1];

    await initOAuthConfig();
    const userInfo = await fetchUserInfo(token);

    if (!userInfo) {
        throw createError({
            statusCode: 401,
            message: 'Invalid token'
        })
    }

    const record = await acc_db.query.users.findFirst({
        where: eq(users.email, userInfo.email)
    })

    if (!record) {
        throw createError({
            statusCode: 401,
            message: 'User not found'
        })
    }
    
    return setCookie(event, "user_info", JSON.stringify(record));
    
});
