## vue-element-admin 安装

- 安装 node.js 及其包管理器 npm
- npm 注册源
```
npm install --registry=https://registry.npm.taobao.org
```

- 安装 Python 2 环境

```
注意在 Windows 中，如果 Python 2 和 Python 3 并存，请将 `Python2.exe` 文件名修改为 `Python.exe`，并设置好环境变量，确保系统不使用 Python 3
```

- 安装 node-sass 等环境

```
npm install node-sass
npm install moment --save
```

- 运行服务器

```
npm run dev
```

#### 问题1 

`Node Sass could not find a binding for your current environment: Windows 64-bit with Node.js 10.x`

#### 解决方案1

```
npm rebuild node-sass
npm update
```

#### 问题2

`gyp verb could not find “msbuild.exe” in PATH - finding location in registry`

`gyp ERR! stack Can’t find “msbuild.exe”. Do you have Microsoft Visual Studio C++ 2008+ installed?`

#### 解决方案2

```
npm config set sass-binary-site http://npm.taobao.org/mirrors/node-sass
npm install node-sass
```

#### 问题3

```
Error: spawn xxxx ENOENT
```

#### 解决方案3

Path 环境变量配置不当，导致无法找到指定的程序，如`Error: spawn cmd.exe ENOENT`，出现该问题的原因是因为没有将`%SystemRoot%\system32` 加入path变量中。

:-(  


## 框架

element <https://element.eleme.cn/2.0/#/zh-CN/component/tree>

### 框架模板

[https://panjiachen.github.io/vue-element-admin-site/zh/guide/#%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84](https://panjiachen.github.io/vue-element-admin-site/zh/guide/#目录结构)

### 下载

<https://github.com/PanJiaChen/vue-element-admin>

### 注意

vue 里不能有多余空行与空格。

### COS安装

npm i scp2 -g

npm i cos-nodejs-sdk-v5 --save

npm install