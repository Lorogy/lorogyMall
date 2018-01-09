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

//查询列表商品
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


//加入到购物车
router.post("/addCart",(req,res,next)=>{console.log(req);
  let userId='100000077';
  //post请求
  let productId=req.body.productId;
  let User=require('../models/user');

  //查找当前用户文档userDoc
  User.findOne({userId:userId},(err,userDoc)=>{
    if(err){
      res.json({
        status:'1',
        msg:err.message
      })
    }else{
      if(userDoc){
        let goodsItem='';
        //遍历购物车列表cartList，若此商品已存在，数量加一，保存；否则Goods查找商品信息，插入当前用户cartList，保存
        userDoc.cartList.forEach((item)=>{
          if(item.productId==productId){
            goodsItem=item;
            item.productNum++;
          }
        })
        //若商品存在，goodsItem不为空；否则，goodsItem为空
        if(goodsItem){
          userDoc.save((err2,doc2)=>{
                  if(err2){
                    res.json({
                      status:'1',
                      msg:err2.message
                    });
                  }
                  else{
                    res.json({
                      status:'0',
                      msg:'',
                      result:'success'
                    })
                  }
                });
        }else{
          //查找要加入购物车商品信息doc1
          Goods.findOne({productId:productId},(err1,doc1)=>{
            if(err1){
              res.json({
                status:'1',
                msg:err1.message
              })
            }
            else{
              if(doc1){
                doc1.productNum=1;
                doc1.checked=1;
                //商品信息插入用户购物车列表
                userDoc.cartList.push(doc1);
                userDoc.save((err2,doc2)=>{
                  if(err2){
                    res.json({
                      status:'1',
                      msg:err2.message
                    });
                  }
                  else{
                    res.json({
                      status:'0',
                      msg:'',
                      result:'success'
                    })
                  }
                });
              }
            }
          })
        }
      }
    }
  })
})

module.exports = router;
