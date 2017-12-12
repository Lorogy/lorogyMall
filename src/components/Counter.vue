<template>
  <div>
    <button v-on:click="increment">+</button>
    <button @click="decrement">-</button>
    <p><span>{{num}}</span></p>
  </div>
</template>
<script>
  export default{
    props:["num"],//父组件数据传到子组件
    data(){
      return{
        num:0
      }
    },
    methods:{
      increment(){
        //this.num++;
        this.$emit('incre');//子组件数据传向父组件
      },
      decrement(){
        //this.num--;
        this.$emit('decre');
      }
    }
  }
</script>
<style>

</style>