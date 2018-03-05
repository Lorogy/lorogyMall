# lorogymall

> A Vue.js project for mall

前端插件：

- vue-cli 手脚架工具
- vue
- vue-router 路由插件
- vue-resource 请求插件
- vue-lazyload 图片懒加载
- vue-infinite-scroll 随滚动无线加载
- axios 请求插件，推荐
- vuex 状态管理

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
//*一级**多级
** 注意 尽量使用ip而不是localhost **
proxyTable: {
        '/goods':{
            target:'http://127.0.0.1:3000'
        },
        '/goods/*':{
            target:'http://127.0.0.1:3000'
        },
        '/users/*':{
            target:'http://localhost:3000'
        }
    },
```
### mock
模拟json数据
### static
大资源，需要请求
### src/main.js
全局插件配置
```
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import {currency} from './util/currency'

Vue.config.productionTip = false
Vue.filter("currency",currency)

Vue.use(VueLazyLoad,{
  loading:"/static/loading-svg/loading-bars.svg"
})

Vue.use(infiniteScroll)
```
### src/router
前端路由
```
import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from '@/views/GoodsList'
import Cart from '@/views/Cart'
import Address from '@/views/Address'

Vue.use(Router)

export default new Router({
  //默认路由模式mode:'hash'有#
  //history无#，主流方式
  mode:'history',
  routes: [
    {
      path:'/',
      name:'GoodsList',
      components:{
        default:GoodsList
      }
    },
    {
      path:'/cart',
      name:'Cart',
      component:Cart
    },
    {
      path: '/goods',
      name: 'GoodsList',
      component: GoodsList
    },
    {
      path:'/address',
      name:'Address',
      component:Address
    },
    {
      path:'/orderConfirm',
      name:'OrderConfirm',
      component:OrderConfirm
    },
    {
      path:'/orderSuccess',
      name:'OrderSuccess',
      component:OrderSuccess
    }
  ]
})
```
### src/assets
小资源，直接用于组件
### src/util
通用文件，currency:金额格式化（$/￥）
### src/components

- 可复用的组件.vue

Counter Header Breadcrumb Footer Modal
计数    头部   面包屑     底部   模态框

### src/components/Header

- 登录功能
- 登出功能
- 登录判断（mounted，如刷新）
- vuex购物车商品数量，用户名

### src/views
界面模板

- GoodLists  购物页面
- Cart  购物车页面
- Address 地址页面
- OrderConfirm 订单创建页面
- OrderSuccess 订单创建成功页面

### src/views/GoodLists

- 基础界面
- 数据渲染
- 响应式布局
- 商品列表查询接口
- 图片加载时动画
- 商品列表分页
- 商品列表排序
- 价格过滤功能
- 请求数据时loading动画
- 加入购物车接口
- 登录全局拦截
- 全局模态框组件Modal实现（添加购物车提示，父子组件变量双向绑定）
- vuex购物车商品数量

### src/views/Cart

- 购物车界面
- 购物车列表功能
- 商品删除功能
- 商品数量加减
- 商品选中功能
- 商品全选功能
- 实时计算功能（是否全选、选中商品总额）
- vuex购物车商品数量

### src/views/Address

- 基础界面
- 地址列表渲染
- 地址列表切换
- 地址列表展开
- 默认地址设置
- 地址删除

### src/views/OrderConfirm

- 基础界面
- 订单商品列表
- 订单金额计算
- 订单确认（通过后端接口生成订单）

### src/views/OrderSuccess

- 基础界面
- 订单信息（订单号、订单总额）
- 跳转（主页、购物车页面）


## demo-server（后端，服务端）

express-generator生成的服务端项目，正常应该是里一个项目（这里为了方便）

### 启动命令
```
node demo-server/bin/www
```
或者
```
pm2 start demo-server/bin/www
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
- 在app.js增加新路由/goods/list

<br/>

- 接口：http://localhost:3000/goods/list
- 功能：分页，按条件查询数据库商品信息
- 查询条件(?)(params)：page、pageSize、sort

### 18-1-1增加功能
查询条件：priceLevel

```
let priceLevel=req.param("priceLevel");
  var priceGt='',priceLte='';
  if(priceLevel!=='all'){
    switch(priceLevel){
      case '0':priceGt=0;priceLte=500;break;
      case '1':priceGt=500;priceLte=1000;break;
      case '2':priceGt=1000;priceLte=2000;break;
    }
    params={
      salePrice:{
        $gt:priceGt,
        $lte:priceLte
      }
    }
  }
  ```

### 18-1-9增加功能

- 建立model,增加users模型
- 建立新路由，post,建立后台api接口

<br/>

- 接口：http://localhost:3000/goods/addCart
- 功能：当前用户的购物车信息添加
- 请求条件(body)：productId

### 18-1-11增加功能
- 登录接口post：查询数据库是否由此用户，若有记录cookie信息
- 登出接口post：清除cookie信息

<br/>

- 接口：http://localhost:3000/goods/login
- 接口：http://localhost:3000/goods/logout

### 18-1-17增加功能
- app.js添加全局拦截

```
//登录拦截，加入购物车等请求必须登录才后能执行
app.use(function(req,res,next){
  console.log(`登录用户：${req.cookies.userId}`);
  if(req.cookies.userId){
    next();
  }else{
    console.log(`path:${req.path},originalUrl:${req.originalUrl}`);
    //req.originalUrl.indexOf('/goods/list')>-1
    if(req.originalUrl=='/users/login'||req.originalUrl=='/users/logout'||req.path=='/goods/list'){
      next();
    }else{
      res.json({
        status:'10001',
        msg:'当前未登录',
        result:''
      })
    }
  }
});
```

- 接口GET：判断请求时，cookie是否有用户登录信息
- 接口：http://localhost:3000/users/checkLogin

### 18-1-20增加功能
- 购物车商品列表接口(get)：http://localhost:3000/users/cartList
- 购物车商品删除接口(post)：http://localhost:3000/users/cartDel

### 18-1-28增加功能
- 购物车商品信息（数量，选中状态）修改接口(post)：http://localhost:3000/users/cartEdit
- 购物车商品全选接口(post)：http://localhost:3000/users/cartEditCheckAll

### 18-1-29增加功能
- 补全/models/user.js模型的addressList数组类型

<br/>

- 用户地址信息查询接口(get)：http://localhost:3000/users/addressList
- 默认地址设置接口(post)：http://localhost:3000/users/setDefault
- 地址删除接口(post)：http://localhost:3000/users/addressDel

### 18-3-1增加功能
- util/util.js 日期格式化 Format()
- payMent接口功能：订单号生成、订单日期生成等等

<br/>

- 订单创建生成接口(post)：http://localhost:3000/users/payMent
- 通过订单号获取订单信息接口(get): http://localhost:3000/users/orderDetail

### 18-3-5增加功能
- 购物车商品数量获取接口(get)：http://localhost:3000/users/getCartCount


## demo学习实例
### demo
es6 axios vue-resource vuex
### server
nodejs