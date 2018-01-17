<template>
  <div>
    <div class="md-modal modal-msg md-modal-transition" v-bind:class="{'md-show':mdShow}">
      <div class="md-modal-inner">
        <div class="md-top">
          <button class="md-close" @click="closeModal">Close</button>
        </div>
        <div class="md-content">
          <div class="confirm-tips">
            <slot name="message"></slot>
          </div>
          <div class="btn-wrap">
            <slot name="btnGroup"></slot>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-if="mdShow" @click="closeModal"></div>
  </div>
</template>
<script>
  export default{
    //父组件传到子组件props
    props:["mdShow"],
    data(){
      return {
        msg:''
      }
    },
    methods:{
      //子组件触发父组件close函数，从而更改父组件mdShow变量的值，使得子组件传到父组件
      closeModal(){
        this.$emit("close")
      }
    }
  }
</script>