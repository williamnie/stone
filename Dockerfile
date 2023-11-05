# 基于Node.js官方镜像构建
FROM node:18-slim

# 设置工作目录
WORKDIR /app

# # 将package.json和package-lock.json（如果存在）复制到工作目录
COPY . /app/


# # build前端
RUN cd adminPage && yarn && yarn build && mv dist ../ && cd .. && rm -rf adminPage && yarn && yarn global add pm2 &&  yarn cache clean

# # # 回到工作目录
# WORKDIR /app
# # 安装koa依赖
# RUN yarn && yarn global add pm2 && yarn cache clean


VOLUME /app/data  

EXPOSE 3000 

# # 使用pm2启动app.js
CMD ["pm2-runtime", "src/app.js"]
