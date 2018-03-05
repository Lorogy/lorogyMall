// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'
import VueLazyLoad from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import {currency} from './util/currency'

Vue.use(Vuex)

Vue.config.productionTip = false
Vue.filter("currency",currency)

Vue.use(VueLazyLoad,{
  loading:"/static/loading-svg/loading-bars.svg"
})

Vue.use(infiniteScroll)

const store=new Vuex.Store({
  state:{
    nickName:'',
    cartCount:0
  },
  mutations:{
    updateUserInfo(state,nickName){
      state.nickName=nickName
    },
    updateCartCount(state,cartCount){
      state.cartCount=cartCount
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
  //render:h=>h(App)
  //render:function(h){
  //return h(App)}
})//.$mount('#app');
