<template>
  <div>
    {{msg}}
    <span>{{$route.query.goodId}}</span>
  </div>
</template>
<style>
  
</style>
<script>
  export default{
    data(){
      return{
        msg:'这是购物车页面'
      }
    }
  }
</script>