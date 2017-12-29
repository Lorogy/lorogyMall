<template>
  <div>
      <nav-header></nav-header>
      <nav-breadcrumb><span slot="bread">Goods</span></nav-breadcrumb>
      <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">Sort by:</span>
            <a href="javascript:void(0)" class="default cur">Default</a>
            <a href="javascript:void(0)" class="price">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
            <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
          </div>
          <div class="accessory-result">
            <!-- filter -->
            <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
              <dl class="filter-price">
                <dt>Price:</dt>
                <dd><a href="javascript:void(0)" v-bind:class="{'cur':priceChecked=='all'}" @click="priceChecked='all'">All</a></dd>
                <dd v-for="(price,index) in priceFilter ">
                  <a href="javascript:void(0)" v-bind:class="{'cur':priceChecked==index}"  @click="setPriceFilter(index)">{{price.startPrice}} - {{price.endPrice}}</a>
                </dd>
              </dl>
            </div>

            <!-- search result accessories list -->
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                <ul>
                  <li v-for="(item,index) in goodsList">
                    <div class="pic">
                      <a href="#"><img v-lazy="'/static/'+item.productImage" alt=""></a>
                    </div>
                    <div class="main">
                      <div class="name">{{item.productName}}</div>
                      <div class="price">{{item.productPrice}}</div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m">加入购物车</a>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
      <nav-footer></nav-footer>
  </div>
</template>
<script>
 import './../assets/css/base.css'
 import './../assets/css/product.css'
 import NavHeader from '@/components/Header.vue'
 import NavFooter from '@/components/Footer.vue'
 import NavBreadcrumb from '@/components/Breadcrumb.vue'
 import axios from 'axios'
 
  export default{
    data(){
      return{
        goodsList:[],
        priceFilter:[
          {
            startPrice:'0.00',
            endPrice:'500.00'
          },
          {
            startPrice:'500.00',
            endPrice:'1000.00'
          },
          {
            startPrice:'1000.00',
            endPrice:'2000.00'
          }
        ],
        priceChecked:'all',
        filterBy:false,
        overLayFlag:false
      }
    },
    components:{
      NavHeader,
      NavFooter,
      NavBreadcrumb
    },
    mounted:function(){
      //通过后台服务端接口获取数据库数据
      this.getGoodsList()
    },
    methods:{
      getGoodsList(){
        //config/index.js的dev下增加代理
       /* proxyTable: {
            '/goods':{
                target:'http://localhost:3000'
            }
        }*/
        axios.get("/goods").then((response)=>{
          let res=response.data
          if(res.status=="0"){
            this.goodsList=res.result.list
          }
          else{
            this.goodsList=[]
          }
        })
      },
      showFilterPop(){
        this.filterBy=true
        this.overLayFlag=true
      },
      closePop(){
        this.filterBy=false
        this.overLayFlag=false
      },
      setPriceFilter(index){
        this.priceChecked=index
        this.closePop()
      }
    }
  }
</script>