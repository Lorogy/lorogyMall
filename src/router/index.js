import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import GoodsList from './../views/GoodsList'
import Title from './../views/Title'
import Image from '@/views/Image'
import Cart from '@/views/Cart'


Vue.use(Router)

export default new Router({
  //默认路由模式mode:'hash'有#
  //history无#，主流方式
  mode:'history',
  routes: [
    {
      path:'/',
      name:'HelloWorld',
      components:{
        default:HelloWorld,
        goodlist:GoodsList,
        title:Title,
        image:Image,
        cart:Cart
      }
    },
    //动态路由params
    {
      path:'/goods/:goodId/user/:name',
      name:'GoodsList',
      component:GoodsList
    },
    //嵌套路由
    {
      path: '/goods',
      name: 'GoodsList',
      component: GoodsList,
      children:[
        {
          path:'title',
          name:'Title',
          component:Title
        },
        {
          path:'image',
          name:'Image',
          component:Image
        }
      ]
    },
    {
      path:'/cart',
      name:'Cart',
      component:Cart
    }
  ]
})
