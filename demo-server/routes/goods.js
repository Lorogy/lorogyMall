var express = require('express');
var router = express.Router();
var mongoose=require('mongoose');
var Goods=require('../models/goods.js');

mongoose.connect('mongodb://127.0.0.1:27017/lorogyMall');
mongoose.connection.on("connected",()=>{
  console.log("MongoDB connected success.")
});
mongoose.connection.on("error",()=>{
  console.log("MongoDB connected fail.")
});
mongoose.connection.on("disconnected",()=>{
  console.log("MongoDB connected disconnected.")
});

router.get("/",(req,res,next)=>{
  //分页，获取请求？page=1&pageSize=8&sort=1
  let page=parseInt(req.param("page"));
  let pageSize=parseInt(req.param("pageSize"));
  let sort=req.param("sort");
  let params={};

  //条件查询
  let priceLevel=req.param("priceLevel");
  var priceGt='',priceLte='';
  if(priceLevel!=='all'){
    switch(priceLevel){
      case '0':priceGt=0;priceLte=500;break;
      case '1':priceGt=500;priceLte=1000;break;
      case '2':priceGt=1000;priceLte=2000;break;
    }
    params={
      salePrice:{
        $gt:priceGt,
        $lte:priceLte
      }
    }
  }

  //跳过skip条，数据开始查询
  //page=1，跳过0条开始查8条,1-8
  //page=2，跳过8条开始查8条,9-16
  //page=3，跳过16条开始查8条,17-24
  //...
  let skip=(page-1)*pageSize;
  //find查找，params查询条件。skip需要跳过前面几条数据，跳过指定数量；limit返回结果最大数量，指定读取数量
  let goodsModel=Goods.find(params).skip(skip).limit(pageSize);
  //sort指定排序方法
  goodsModel.sort({'salePrice':sort});
  //Goods.find({},(err,doc)=>{})
  goodsModel.exec({},(err,doc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message
      })
    }
    else{
      res.json({
        status:'0',
        msg:'',
        result:{
          count:doc.length,
          list:doc
        }
      })
    }
  })
})

module.exports = router;
