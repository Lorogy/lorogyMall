import Vue from 'vue'
import Router from 'vue-router'
import GoodsList from '@/views/GoodsList'


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
    }
  ]
})
