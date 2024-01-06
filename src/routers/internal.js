import Router from '@koa/router';
import * as storeService from '../service/db.js';

const internalRouter = new Router();

internalRouter.post('/internal/db/createSubLeavel', async (ctx, next) => {
    const dbName = await storeService.createSubLeavel(ctx, ctx.request.body)
    ctx.body = dbName
});

internalRouter.post('/internal/db/getData', async (ctx, next) => {
    const data = await storeService.getData(ctx, ctx.request.body)
    ctx.body = data
});

internalRouter.post('/internal/db/createData', async (ctx, next) => {
    const data = await storeService.createData(ctx, ctx.request.body)
    ctx.body = data
});

internalRouter.post('/internal/db/deleteData', async (ctx, next) => {
    const data = await storeService.deleteData(ctx, ctx.request.body)
    ctx.body = data
});


export default internalRouter
