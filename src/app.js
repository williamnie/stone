import Koa from 'koa';
import { koaBody } from 'koa-body';
import Router from '@koa/router';
import cors from 'koa2-cors'
import { Level } from 'level';
import path from 'path';
import fs from 'fs';

import internalRouter from './routers/internal.js'
import adminRouter from './routers/admin.js';
import * as codeService from './service/code.js'
import helper from './utils/index.js';
import WorkerPool from './workerPro.js'
import { initUserInfo, woorkerPoolNum } from './config/user.js'
import { serverConfig } from './config/system.js'


const app = new Koa();
const router = new Router();

const db = new Level('../data/dbStore', { valueEncoding: 'json' })
app.context.db = db
app.context.helper = helper

app.use(koaBody({ multipart: true }));

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
  .use(internalRouter.routes())
  .use(adminRouter.routes())
  .use(router.routes())
  .use(internalRouter.allowedMethods())
  .use(adminRouter.allowedMethods())
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
    console.log('初始化路由成功🙂');
  } catch (error) {
    console.log('初始化路由失败', error);
  }
}

const initWorkerPool = async () => {
  const routerStore = await getRouter()
  try {
    const pool = new WorkerPool(routerStore, woorkerPoolNum);
    console.log('初始化worker成功🙂');
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

const initUser = async () => {
  let users = null
  try {
    users = await app.context.db.get('sys_user')
  } catch (error) {
    console.log('不存在初始用户，开始初始化用户🚀');
  }
  const { email, password } = initUserInfo
  if (!users) {
    const newUser = { id: helper.uuid(), email, password: await helper.genHash(password) }
    const initUser = { [email]: newUser }
    app.context.db.put('sys_user', initUser)
    console.log('初始化用户成功🙂');
  }
}

app.listen(serverConfig?.port, async () => {
  try {
    confirmDir()
    await initRouter()
    await initWorkerPool()
    await initUser()
  } catch (error) {
    console.log('error', error);
  }

  console.log(`🎆服务启动成功: ${serverConfig?.port}🎆`);
});

