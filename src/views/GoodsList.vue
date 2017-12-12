<template>
  <div>
    {{msg}}
    <span>{{$route.params.goodsId}}</span>
    <br/>
    <span>用户名为{{$route.params.name}}</span>
    <br/>
    <!-- to必须是绝对地址 -->
    <router-link to="/goods/title">显示商品标题</router-link>
    <router-link to="/goods/image">显示商品图片</router-link>
    <div>
      <router-view></router-view>
    </div>
    <router-link to="/cart">跳转到购物车页面</router-link>
    <router-link v-bind:to="{name:'Cart',query:{goodId:1234}}">跳转到购物车页面</router-link>
    <br/>
    <!-- 编程式路由 -->
    <button @click="jump">btn-跳转到购物车页面</button>
  </div>
</template>
<style>
  
</style>
<script>
  export default{
    data(){
      return{
        msg:'这是商品列表页面'
      }
    },
    methods:{
      jump(){
        //编程式路由
        //this.$router.push("/cart")
        this.$router.push({path:"/cart?goodId=123"})
        //this.$router.go(-2)
      }
    }
  }
</script>