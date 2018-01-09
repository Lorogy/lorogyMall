<template>
  <div>
      <nav-header></nav-header>
      <nav-breadcrumb><span slot="bread">Goods</span></nav-breadcrumb>
      <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">Sort by:</span>
            <a href="javascript:void(0)" class="default cur">Default</a>
            <a href="javascript:void(0)" class="price" @click="sortGoods">
              Price 
              <svg class="icon icon-arrow-short">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-arrow-short"></use>
              </svg>
            </a>
            <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
          </div>
          <div class="accessory-result">
            <!-- filter -->
            <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
              <dl class="filter-price">
                <dt>Price:</dt>
                <dd><a href="javascript:void(0)" v-bind:class="{'cur':priceChecked=='all'}" @click="setPriceAll">All</a></dd>
                <dd v-for="(price,index) in priceFilter ">
                  <a href="javascript:void(0)" v-bind:class="{'cur':priceChecked==index}"  @click="setPriceFilter(index)">
                    {{price.startPrice}} - {{price.endPrice}}
                  </a>
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
                      <div class="price">{{item.salePrice}}</div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                      </div>
                    </div>
                  </li>
                </ul>
                <div class="loadmore" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="20">
                  <img src="./../assets/loading-spinning-bubbles.svg" alt="加载中" v-show="loading">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
      <nav-footer></nav-footer>
  </div>
</template>
<style>
.loadmore{
  height: 100px;
  line-height: 100px;
  text-align: center;
}
</style>
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
        sortFlag:true,
        page:1,
        pageSize:8,
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
        //当前查询价格索引：all、0-2
        priceChecked:'all',
        //响应式布局时的弹框显示，默认不显示
        filterBy:false,
        //响应式布局时的遮罩显示，默认不显示
        overLayFlag:false,
        //图片随滚动继续加载功能，默认关闭
        busy:true,
        //请求数据动画svg，默认不显示,向后台请求数据时显示
        loading:false
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
      getGoodsList(flag){
        let param={
          page:this.page,
          pageSize:this.pageSize,
          sort:this.sortFlag?1:-1,
          priceLevel:this.priceChecked
        }

        this.loading=true

        //config/index.js的dev下增加代理
         /* proxyTable: {
              '/goods':{
                  target:'http://localhost:3000'
              }
          }*/
        axios.get("/goods",{
          params:param
        }).then((response)=>{
          let res=response.data
          this.loading=false
          if(res.status=="0"){
            //判断是否是在之前基础上继续加载
            if(flag){
              //之前加载数据与新加载数据
              this.goodsList=this.goodsList.concat(res.result.list)

              //若商品数据已全部加载完，停止加载更多功能
              if(res.result.count==0){
                this.busy=true
              }else{
                this.busy=false
              }
            }
            //第一次加载
            else{
              this.goodsList=res.result.list
              this.busy=false
            }
            
          }
          else{
            this.goodsList=[]
          }
        })
      },
      //点一下排序，从头开始排，并改变排序方法
      sortGoods(){
        this.sortFlag=!this.sortFlag
        this.page=1
        this.getGoodsList()
      },
      //随屏幕滚动，加载更多（下一页）商品信息，加载过程不触发加载
      loadMore(){
        this.busy=true

        setTimeout(()=>{
          this.page++
          this.getGoodsList(true)
        }, 500);
      },
      //响应式布局时点击filterby显示弹框与遮罩
      showFilterPop(){
        this.filterBy=true
        this.overLayFlag=true
      },
      //(响应式布局)关闭弹框与遮罩
      closePop(){
        this.filterBy=false
        this.overLayFlag=false
      },
      //点击设置价格索引；请求页数从头开始；响应式布局时关闭弹窗与遮罩
      setPriceFilter(index){
        this.priceChecked=index
        this.page=1
        this.getGoodsList()
        this.closePop()
      },
      //点击选择所有价格时
      setPriceAll(){
        this.priceChecked='all'
        this.page=1
        this.getGoodsList()
        this.closePop()
      },
      //加入购物车
      //点击按钮，触发后台服务器请求，改变数据库信息
      addCart(productId){
        axios.post("/goods/addCart",{
          productId:productId
        }).then((res)=>{
          if(res.data.status=="0"){
            alert("加入成功")
          }
          else{
            alert("msg:"+res.data.msg)
          }
        })
      }
    }
  }
</script>