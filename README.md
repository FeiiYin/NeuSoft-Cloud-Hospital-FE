## 东软HIS医院管理系统 客户端

NeuSoft hospital information system

东软睿道 - Java 互联网架构 - 实训项目

### 环境与工具

环境安装参阅 `install.md`.

- 建议使用 WebStorm 开发。
- node.js & npm
- vue-element-admin 后台前端框架
- vue-element-extends

```
npm install xe-utils vue-element-extends --save
npm i vue-element-extends
```

### 网络

- 前端默认使用端口号 9527，与服务器端的交互请查阅 `vue-element/.env.development`，`vue-element/src/utils/request.js`.
 
### 与服务器端交互

客户端与服务器端的交互通过相关 API 实现。
详见 `src/api/README.md`.

### 视图

视图通过 Vue 实现。
详见 `src/view/README.md`.

### 路由

`src/router`.

### 命名规范

