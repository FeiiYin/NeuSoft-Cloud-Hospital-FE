
FROM node:latest

#指定维护者的信息
MAINTAINER mser

#将根目录下的文件都copy到container（运行此镜像的容器）文件系统的app文件夹下
ADD . /app/

#cd到app文件夹下
WORKDIR /app
RUN npm --registry https://registry.npm.taobao.org install express
#安装项目依赖包
RUN npm install
RUN npm rebuild node-sass --force

#配置环境变量
ENV HOST 0.0.0.0
ENV PORT 9527

#容器对外暴露的端口号
EXPOSE 9527

#容器启动时执行的命令 每个Dockerfile只有一个CMD命令 多了则会覆盖之前的CMD
CMD ["npm", "run","dev"]
