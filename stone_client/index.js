import * as store from './kvStore.js'
import got from 'got'
import { parentPort } from 'worker_threads';

const stone = async (func) => {
    parentPort.on('message', async (ctx = {}) => {
        const _header = {}
        ctx.set = (key, value) => {
            _header[key] = value
        }
        if (func) {
            const funcRes = await func(ctx)
            if (funcRes) {
                parentPort.postMessage({ ...funcRes, _header } || { code: 10404, message: '方法没有返回值' });
            }
        } else {
            parentPort.postMessage({ code: 10404, message: '未匹配到function' });
        }

    });
}



export { store, got, stone }