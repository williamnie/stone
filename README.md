## Stone 一个基于Nodejs woker-threads的Serverless玩具

### 为什么要写这样一个玩具

起因是我想有个能动态的mock server，能动态的匹配路由，能对数据进行增删改查的动作，这样我就能做全流程的mock测试。
比如一个table列表+编辑表单的页面，可以完整的mock全流程数据，页面也能完成所有的操作。降低单一api mock带来的问题。
本来是想使用 [laf](https://github.com/labring/laf) 的，但是laf安装绑定了sealos，不是很符合我的需求，于是就写了
一个简单的服务

### 为什么没选择使用vm来运行客户端代码

除了上面说的动态的mock数据功能，平时还想运行一些脚本，不用每次都找个地方写完了，还需要打开终端node一下，所以选择了权限更松散的worker thread

### 服务现状&计划
> 服务目前处于开发阶段，勉强能用，由于是个人使用，没加登录等鉴权功能，不适合用于生产环境。

计划：

* [x] 管理页面增加登录验证，内部api增加鉴权
* [ ] 增加Docker部署方式（已支持自己可以本地build）
* [ ] 增加日志功能，将console.log 替换为log4js
* [ ] 前端增加调试日志输出
* [ ] 整体切换到bun运行时（也可能放到第一个做）

### 目录介绍

```
.
├── Dockerfile
├── README.md
├── adminPage   //前端管理页面，可管理function和数据
│   ├── README.md
│   ├── node_modules
│   ├── package.json
│   ├── src
│   ├── tsconfig.json
│   ├── typings.d.ts
│   ├── yarn-error.log
│   └── yarn.lock
├── data //用户数据目录，Level Db数据及用户的代码文件
│   ├── dbStore
│   └── userService
|
├── stone_client //serverless的client端使用的方法
├── src
│   ├── app.js //koa server入口文件，里面包含了启动的逻辑
│   ├── service //处理db和运行逻辑的代码
│   ├── config //系统配置和用户配置
│   ├── utils //帮助函数
│   ├── middleware //中间件
│   └── workerPro.js //使用work_thread构建的线程池
├── nodemon.json
├── package.json
└── yarn.lock

```

### 本地开发
启动server端
`node src/app.js 或者 yarn start`

启动web端
`cd adminPage && yarn dev`

### 本地部署
build web端
`cd adminPage && yarn build && mv dist ../ `

启动 server 端 （建议使用pm2启动）
`pm2 start src/app.js 或 node src/app.js `


