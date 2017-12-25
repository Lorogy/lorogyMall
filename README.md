# lorogymall

> A Vue.js project for mall

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

## 项目文件修改内容
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
