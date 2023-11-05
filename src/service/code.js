import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
const __dirname = dirname(fileURLToPath(import.meta.url))

const userServiceBasePath = '../../data/userService'
const saveCode = async (ctx) => {
    const { router, method, code } = ctx.request.body
    let currentRouterInfo = {}
    try {
        currentRouterInfo = await ctx.db.get('_routerConfig')
    } catch (error) {
        // return { code: 2, message: '获取路由表失败' }
    }
    let fileName = router.replaceAll(path.sep, '')
    fileName = `${fileName}+${method}`
    const filePath = path.join(__dirname, `${userServiceBasePath}/${fileName}.js`)
    try {
        fs.writeFileSync(filePath, code)
    } catch (error) {
        return { code: 4, message: '将code写入文件失败' }
    }
    //如果路由已经存在，则需要将workerPool里的worker销毁并重建
    if (currentRouterInfo[`${router}+${method}`]) {
        await ctx.workerPool.restartWorkers({ router, method, path: filePath })
    } else {
        // 路由不存在则新建一个worker
        await ctx.workerPool.addWorker({ router, method, path: filePath })
        currentRouterInfo[`${router}+${method}`] = { method, path: filePath }
        ctx.router[method](router, codeWorker)
        ctx.db.put('_routerConfig', currentRouterInfo)
    }
    return { code: 0, message: '' }
}

const listFunctions = async (ctx) => {
    let currentRouterInfo
    try {
        currentRouterInfo = await ctx.db.get('_routerConfig') || {}
    } catch (error) {
    }
    const func = []
    // 找到userService下的所有文件，构造obj，做索引
    const allFiles = fs.readdirSync(path.join(__dirname, userServiceBasePath))
    const fileIndex = {}
    for (const file of allFiles) {
        fileIndex[file] = 1
    }

    // 找到路由内的所有数据，给每个路由增加一个属性：文件是否存在,0则证明文件不存在
    for (const key in currentRouterInfo) {
        if (Object.hasOwnProperty.call(currentRouterInfo, key)) {
            const { method, path: _path } = currentRouterInfo[key];
            const fileName = path.basename(_path)
            func.push({
                router: key.replace(`+${method}`, ''),
                method,
                file: fileIndex[fileName] || 0
            })
        }
    }
    return { code: 0, data: func, message: '' }
}

const deleteFunction = async (ctx) => {
    const { router, method } = ctx.request.body || {}
    try {
        // 删除worker
        const { code, message } = await ctx.workerPool.destroy(ctx.request.body)
        // 只有100才报错，如果是101则继续进行
        if (code === 100) {
            return { code: 1, message }
        }
        // 删除router,直接返回404
        ctx.router[method](router, (ctx) => { ctx.status = 404 })
        // 删除kvstore中的router数据
        const currentRouterInfo = await ctx.db.get('_routerConfig') || {}
        const newRouterInfo = {}
        let filePath = ''
        for (const key in currentRouterInfo) {
            if (Object.hasOwnProperty.call(currentRouterInfo, key)) {
                const { method: _method, path: _path } = currentRouterInfo[key];
                filePath = _path
                if (key !== `${router}+${method}`) {
                    newRouterInfo[key] = currentRouterInfo[key]
                }
            }
        }
        await ctx.db.put('_routerConfig', newRouterInfo)
        if (fs.existsSync(filePath)) {
            fs.rmSync(filePath)
        }
        return { code: 0, message: '' }
    } catch (error) {

        return { code: 2, message: error.message }
    }
}

const getFunctionDetail = async (ctx) => {
    const { router, method } = ctx.request.body || {}
    try {
        const currentRouterInfo = await ctx.db.get('_routerConfig') || {}
        let filePath = ''
        for (const key in currentRouterInfo) {
            if (Object.hasOwnProperty.call(currentRouterInfo, key)) {
                const { method: _method, path: _path } = currentRouterInfo[key];
                if (key === `${router}+${method}`) {
                    filePath = _path
                }
            }
        }
        let code = ''
        if (fs.existsSync(filePath)) {
            code = fs.readFileSync(filePath, 'utf-8')
        }
        return { code: 0, data: { code }, message: '' }
    } catch (error) {
        return { code: 2, message: error.message }
    }
}




const copyCtx = (ctx) => {
    const _ctx = {}
    _ctx['url'] = ctx.url
    _ctx['method'] = ctx.method
    _ctx['headers'] = ctx.headers
    _ctx['query'] = ctx.query || {}
    _ctx['request'] = {}
    _ctx['body'] = ctx.request.body
    _ctx['cookie'] = ctx.cookie
    _ctx.request.files = ctx.request.files ? {
        file: {
            lastModifiedDate: ctx.request.files.file.lastModifiedDate,
            filepath: ctx.request.files.file.filepath,
            newFilename: ctx.request.files.file.newFilename,
            originalFilename: ctx.request.files.file.originalFilename,
            size: ctx.request.files.file.size,
            // _writeStream: ctx.request.files.file._writeStream,
        }
    } : {}
    return _ctx

}


const codeWorker = async (ctx) => {
    // 首先获取所有的路由，匹配一下，找到对应的代码地址
    const allRouter = await ctx.db.get('_routerConfig')
    const routerIndex = { ...allRouter }
    for (const key in allRouter) {
        if (Object.hasOwnProperty.call(allRouter, key)) {
            const { method } = allRouter[key];
            routerIndex[key.replace(`+${method}`, '')] = allRouter[key]
        }
    }
    const currentRouter = routerIndex[ctx._matchedRoute]
    if (!currentRouter) {
        ctx.throw(404);
    }
    const { path } = currentRouter
    const fileExit = fs.existsSync(path)
    if (!fileExit) {
        ctx.throw(404);
    }

    // 检查线程池内是否有这个路由，如果没有则新建一个线程运行，如果存在，直接调用，这里需要注意
    // 线程是否忙碌
    // TODO: 写一个copyCtx的方法，暂时先这样，先不管上传逻辑
    const _ctx = copyCtx(ctx)
    let result = { data: {} }
    try {
        result = await ctx.workerPool.run({ router: ctx._matchedRoute, ...currentRouter }, _ctx);

    } catch (error) {

    }
    if (result && result._header) {
        for (const key in result._header) {
            if (Object.hasOwnProperty.call(result._header, key)) {
                const ele = result._header[key];
                ctx.set(key, ele)
            }
        }
    }
    ctx.body = result.data || {};
}




export { saveCode, codeWorker, listFunctions, deleteFunction, getFunctionDetail }