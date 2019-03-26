/**
 * api login interceptors (aop) 
 * include: need to verify path array，exclude:besides this,the rest need verify
 */
module.exports = opt => {
    const config = Object.assign({ include: [], exclude: [] }, opt);
    return async (ctx, next) => {
        if (!config.exclude.includes(ctx.path)||config.include.includes(ctx.path)) {
            const token = await ctx.verify();
            if (!token.isValid) {
                return ctx.body = {
                    code: 1,
                    message: '未登录'
                };
            }
        }
        await next();
    };
};