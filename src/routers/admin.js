import Router from '@koa/router';
import * as storeService from '../service/db.js';
import * as codeService from '../service/code.js'
import * as userService from '../service/user.js'
import { verifyToken } from '../middleware/index.js'


const adminRouter = new Router();

adminRouter.post('/api/saveFunction', verifyToken, async (ctx, next) => {
    const res = await codeService.saveCode(ctx)
    ctx.body = res
});

adminRouter.get('/api/listFunctions', verifyToken, async (ctx, next) => {
    const res = await codeService.listFunctions(ctx)
    ctx.body = res
});

adminRouter.post('/api/deleteFunction', verifyToken, async (ctx, next) => {
    const res = await codeService.deleteFunction(ctx)
    ctx.body = res
});

adminRouter.post('/api/getFunctionDetail', verifyToken, async (ctx, next) => {
    const res = await codeService.getFunctionDetail(ctx)
    ctx.body = res
});


adminRouter.get('/api/getAllKV', verifyToken, async (ctx, next) => {
    const res = await storeService.getAllKV(ctx)
    ctx.body = res
});

adminRouter.get('/api/getKV/:key', verifyToken, async (ctx, next) => {
    const { key } = ctx.params
    const res = await storeService.getData(ctx, { key, })
    ctx.body = { code: 0, data: res, message: '' }
});

adminRouter.post('/api/saveKV', verifyToken, async (ctx, next) => {
    const { key, value } = ctx.request.body
    const res = await storeService.createData(ctx, { data: { key, value } })
    ctx.body = { code: 0, data: res, message: '' }
});

adminRouter.delete('/api/deleteKV/:key', verifyToken, async (ctx, next) => {
    const { key } = ctx.params
    const res = await storeService.deleteData(ctx, { key })
    ctx.body = { code: 0, data: res, message: '' }
});

// 用户登录
adminRouter.post('/api/login', async (ctx, next) => {
    const data = await userService.login(ctx)
    ctx.body = data
});



export default adminRouter
