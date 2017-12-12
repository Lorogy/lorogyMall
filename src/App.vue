<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view/>
    <router-view class="main" name="goodlist"/>
    <router-view class="left" name="title"/>
    <router-view class="right" name="image"/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.left,.right{
  width: 49%;
  border: 1px solid gray;
  float: left;
}
</style>
