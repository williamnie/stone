import Koa from 'koa';
import { koaBody } from 'koa-body';
import * as storeService from './service/db.js';
import * as codeService from './service/code.js'
import WorkerPool from './workerPro.js'
import Router from '@koa/router';
import cors from 'koa2-cors'
import { Level } from 'level';
import path from 'path';
import fs from 'fs';


const app = new Koa();
const router = new Router();

const db = new Level('./data/dbStore', { valueEncoding: 'json' })
app.context.db = db
app.context.storeService = storeService

app.use(koaBody({ multipart: true }));


router.post('/internal/db/createSubLeavel', async (ctx, next) => {
  const dbName = await storeService.createSubLeavel(ctx, ctx.request.body)
  ctx.body = dbName
});

router.post('/internal/db/getData', async (ctx, next) => {
  const data = await storeService.getData(ctx, ctx.request.body)
  ctx.body = data
});

router.post('/internal/db/createData', async (ctx, next) => {
  const data = await storeService.createData(ctx, ctx.request.body)
  ctx.body = data
});

router.post('/internal/db/deleteData', async (ctx, next) => {
  const data = await storeService.deleteData(ctx, ctx.request.body)
  ctx.body = data
});


router.post('/api/saveFunction', async (ctx, next) => {
  const res = await codeService.saveCode(ctx)
  ctx.body = res
});

router.get('/api/listFunctions', async (ctx, next) => {
  const res = await codeService.listFunctions(ctx)
  ctx.body = res
});

router.post('/api/deleteFunction', async (ctx, next) => {
  const res = await codeService.deleteFunction(ctx)
  ctx.body = res
});

router.post('/api/getFunctionDetail', async (ctx, next) => {
  const res = await codeService.getFunctionDetail(ctx)
  ctx.body = res
});


router.get('/api/getAllKV', async (ctx, next) => {
  const res = await storeService.getAllKV(ctx)
  ctx.body = res
});

router.get('/api/getKV/:key', async (ctx, next) => {
  const { key } = ctx.params
  const res = await storeService.getData(ctx, { key, })
  ctx.body = { code: 0, data: res, message: '' }
});

router.post('/api/saveKV', async (ctx, next) => {
  const { key, value } = ctx.request.body
  const res = await storeService.createData(ctx, { data: { key, value } })
  ctx.body = { code: 0, data: res, message: '' }
});

router.delete('/api/deleteKV/:key', async (ctx, next) => {
  const { key } = ctx.params
  const res = await storeService.deleteData(ctx, { key })
  ctx.body = { code: 0, data: res, message: '' }
});

const staticDir = './dist';
app.use(async (ctx, next) => {
  const filePath = path.join(staticDir, ctx.url);
  if (path.extname(filePath) === '.js' || path.extname(filePath) === '.css') {
    if (path.extname(filePath) === '.js') {
      ctx.set('content-type', 'text/javascript');
    } else {
      ctx.set('content-type', 'text/css');
    }
    ctx.body = fs.createReadStream(filePath);
  } else if (ctx.url === '/' || ctx.url === '/home' || ctx.url === '/kv') {
    ctx.set('content-type', 'text/html');
    ctx.body = fs.createReadStream(path.join(staticDir, 'index.html'));
  } else if (ctx.url === '/favicon.ico') {
    ctx.set('content-type', 'image/x-icon');
    ctx.body = fs.createReadStream(path.join(staticDir, 'favicon.ico'));
  } else {
    await next()
  }
})


app
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods());



const getRouter = async () => {
  const allowMethod = {
    'get': 1,
    post: 1,
    put: 1,
    delete: 1,
    patch: 1
  }
  try {
    const routerStore = await app.context.db.get('_routerConfig')
    if (routerStore) {
      const routers = []
      for (const key in routerStore) {
        const { method } = routerStore[key]
        if (allowMethod[method]) {
          routers.push({ router: key, ...routerStore[key] })
        }
      }
      return routers
    } else {
      return []
    }
  } catch (error) {
    return []
  }
}

const initRouter = async () => {

  try {
    const routerStore = await getRouter()
    routerStore.forEach((item) => {
      router[item.method](item.router?.replace(`+${item.method}`, ''), codeService.codeWorker)
    })
    console.log('初始化路由成功');
  } catch (error) {
    console.log('初始化路由失败', error);
  }
}

const initWorkerPool = async () => {
  const routerStore = await getRouter()
  try {
    const pool = new WorkerPool(routerStore, 1);
    console.log('初始化worker成功');
    app.context.workerPool = pool
  } catch (error) {
    console.log('9', error);
  }
}

const confirmDir = () => {
  const directoryPath = './data/userService';
  const isExist = fs.existsSync(directoryPath)
  if (!isExist) {
    try {
      fs.mkdirSync(directoryPath)
    } catch (error) {
      console.log('创建用户目录失败');
    }
  }
}

app.listen(3000, async () => {
  try {
    confirmDir()
    await initRouter()
    await initWorkerPool()
  } catch (error) {
  }

  console.log('server start: 3000');
});

