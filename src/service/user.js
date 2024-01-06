

const login = async (ctx) => {
    const { email, password } = ctx.request.body
    const users = await ctx.db.get('sys_user') || {}
    const _user = users[email]
    if (!_user) {
        return { code: 1, data: {}, message: '邮箱或密码错误' }
    } else {
        const isTrue = await ctx.helper.compare(_user?.password, password)
        const user = {
            id: _user?.id
        }
        user.token = ctx.helper.genToken(user)
        if (isTrue) {
            return { code: 0, data: user, message: '' }
        } else {
            return { code: 1, data: {}, message: '邮箱或密码错误' }
        }
    }
}

const signUp = async (ctx) => {
    const { email, password } = ctx.request.body
    const users = await ctx.db.get('sys_user') || {}
    const _user = users[email]
    if (_user) {
        return { code: 1, data: {}, message: '账号已存在' }
    } else {
        const newUser = { id: ctx.helper.uuid(), email, password: await ctx.helper.genHash(password) }
        users[email] = newUser
        ctx.db.put('sys_user', users)
        return { code: 0, data: { id: newUser.id }, message: '' }
    }
}


export { login, signUp }