
import { Worker } from 'worker_threads';
import fs from 'fs'

class WorkerPool {
    _queue = [];                      // 任务队列

    constructor(routerToWorker, numOfThreads) {
        this.routerToWorker = routerToWorker;
        this.numOfThreads = numOfThreads || 1;
        this.routerToWorkerId = {}
        this.init();
    }

    // 初始化多线程
    init() {
        if (this.numOfThreads < 1) {
            throw new Error('线程池最小线程数应为1');
        }

        for (let index = 0; index < this.routerToWorker.length; index++) {
            const { path, router, method } = this.routerToWorker[index];
            const fileExit = fs.existsSync(path)
            if (fileExit) {
                const _workers = []
                const _activeWorkers = []
                for (let i = 0; i < this.numOfThreads; i++) {
                    try {
                        const worker = new Worker(path);
                        _workers[i] = worker;
                        _activeWorkers[i] = false;
                    } catch (error) {
                        console.log('6', error);
                    }

                }
                this.routerToWorkerId[router] = { _workers, _activeWorkers }
            }
        }

    }

    async addWorker(routerInfo) {
        const { router, path, method } = routerInfo || {}
        const fileExit = fs.existsSync(path)
        if (fileExit) {
            const _workers = []
            const _activeWorkers = []
            for (let i = 0; i < this.numOfThreads; i++) {
                const worker = new Worker(path);
                _workers[i] = worker;
                _activeWorkers[i] = false;
            }
            this.routerToWorkerId[`${router}+${method}`] = { _workers, _activeWorkers }
        }
    }

    // 结束线程池中指定的线程
    destroy(routerInfo) {
        const { router, method } = routerInfo
        if (!router || !method) {
            return { code: 100, message: '缺少router或者method参数' }
        }
        if (!this.routerToWorkerId[`${router}+${method}`]) {
            return { code: 101, message: '该路由没分配worker' }
        }
        const { _workers, _activeWorkers } = this.routerToWorkerId[`${router}+${method}`]

        for (let i = 0; i < _activeWorkers; i++) {
            //TODO: 暂时先全部destory吧，最好是搞成动态清除其他没工作的线程，在设置个callback等结束后清理工作进程
            // if (_activeWorkers[i]) {
            //     // return { code: 102, message: `路由：${router}的${i}号线程仍在工作中...` }
            //     // throw new Error(`路由：${router}的${i}号线程仍在工作中...`);
            // }
            _workers[i].terminate();
        }
        return { code: 0, message: '' }
    }

    // 检查是否有空闲worker
    async checkWorkers(routerInfo) {
        const { router, method } = routerInfo || {}
        const { _activeWorkers } = this.routerToWorkerId[`${router}+${method}`] || {}
        // 如果检测不到_activeWorkers，则证明这个路由没有被创建worker，
        // 就会自动创建 numOfThreads 个 worker等待备用
        if (!_activeWorkers) {
            // process.abort()
            await this.addWorker(routerInfo)
            this.checkWorkers(routerInfo)
        }
        else {
            return _activeWorkers.findIndex(item => item === false);
        }
    }
    async restartWorkers(routerInfo) {
        const { code } = this.destroy(routerInfo)
        if (code === 0) {
            await this.addWorker(routerInfo)
        } else {
            return {
                code: 104,
                message: `重启失败，请检查路由：${routerInfo.router}`
            }
        }
    }
    run(routerInfo, getData) {
        return new Promise(async (resolve, reject) => {
            const { router, method } = routerInfo || {}
            const restWorkerId = await this.checkWorkers(routerInfo);
            const queueItem = {
                getData,
                callback: (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(result);
                }
            }
            // 线程池已满,将任务加入任务队列 
            if (restWorkerId === -1) {
                this._queue.push({ routerInfo, getData });
                return null;
            }

            // 空闲线程执行任务
            this.runWorker(`${router}+${method}`, restWorkerId, queueItem);
        })
    }



    async runWorker(router, workerId, queueItem) {
        const { _workers, _activeWorkers } = this.routerToWorkerId[router] || {}

        const worker = _workers[workerId];
        if (!worker) {
            return {
                code: 404,
                message: '未找到相关的worker'
            }
        }
        _activeWorkers[workerId] = true;

        // 线程结果回调
        const messageCallback = (result) => {
            queueItem.callback(null, result);
            cleanUp();
        };

        // 线程错误回调
        const errorCallback = (error) => {
            queueItem.callback(error);
            cleanUp();
        };

        // 任务结束消除旧监听器,若还有待完成任务,继续完成
        const cleanUp = () => {
            worker.removeAllListeners('message');
            worker.removeAllListeners('error');

            _activeWorkers[workerId] = false;

            if (!this._queue.length) {
                return null;
            }
            const { routerInfo, getData } = this._queue.shift()
            this.run(routerInfo, getData);
        }

        // 线程创建监听结果/错误回调
        worker.once('message', messageCallback);
        worker.once('error', errorCallback);
        // 向子线程传递初始data
        worker.postMessage(queueItem.getData);
    }
}

export default WorkerPool;