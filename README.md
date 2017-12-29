# lorogymall

> A Vue.js project for mall

前端插件：

- vue-cli 手脚架工具
- vue 
- vue-router 路由插件
- vue-resource 请求插件
- vue-lazyload 图片懒加载
- axios 请求插件，推荐

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## 项目文件修改内容（前端，客户端）
### build/webpack.dev.conf.js
模拟加载后台数据
添加：
```
const express=require('express')
const app=express()
const router=express.Router()
const goodsData=require('./../mock/goods.json')
```
在devServer: 下修改
```
//模拟加载后台数据
    before(router){
      router.get('/goods',(req,res)=>{
        res.json(goodsData)
      })
      app.use(router)
    }
```
### config/index.js
运行时自动打开浏览器
```
autoOpenBrowser: true,
```
静态资源地址
```
assetsPublicPath: 'http://www.lorogy.com/lorogymail',
```
dev下增加代理，用于访问后台服务端提供的接口，获取数据库数据
```
proxyTable: {
  '/goods':{
      target:'http://localhost:3000'
  }
}
```
### mock
模拟json数据
### static
大资源，需要请求
### src/assets
小资源，直接用于组件
### src/components
可复用的组件.vue
Counter Header Breadcrumb Footer
### src/views
界面模板
GoodLists


## demo-server（后端，服务端）

express-generator生成的服务端项目，正常应该是里一个项目（这里为了方便）

### 启动命令
```
node /demo-server/bin/www
```
或者
```
pm2 start /demo-server/bin/www
```

### 修改部分

- 将package.json与lorogyMall项目的package.json合并（只用合并依赖）
- `npm install`安装依赖
- 修改模板引擎为html

### jade修改为html方法：

- views 新建XXX.html文件
- router 修改XXX
- app.js 修改如下

```
var ejs = require('ejs');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',ejs.__express);
app.set('view engine', 'html');
//app.set('view engine', 'jade');
```

### 17-12-19增加功能
- 引入mongoose
- 建立model,增加goods模型
- 在route新增路由，goods.js，建立后台接口api
- 在app.js增加新路由/goods

接口：http://localhost:3000/goods
功能：分页，按条件查询数据库商品信息
查询条件(?)：page、pageSize、sort


## demo学习实例
### demo
es6 axios vue-resource
### server
nodejs