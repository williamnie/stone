
const verifyToken = async (ctx, next) => {
    try {
        if (ctx && ctx.request && ctx.request.header && ctx.request.header.authorization) {
            let token = ctx.request.header.authorization;
            token = token.replace('Bearer ', '')
            const isTrue = ctx.helper.verifyToken(token);
            if (isTrue) {
                await next();
            } else {
                ctx.body = { code: 4, data: '', message: '无权限' };
            }
        } else {
            ctx.body = { code: 4, data: '', message: '无权限' };
        }
    } catch (error) {
        console.log('jwt中间件', error);
    }

}

export default verifyToken 