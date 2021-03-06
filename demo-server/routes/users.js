var express = require('express');
var router = express.Router();
require('./../util/util')
var User = require('./../models/user')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//登录接口
router.post('/login', function(req, res, next) {
  let param={
    userName:req.body.userName,
    userPwd:req.body.userPwd
  }

  User.findOne(param,(err,doc)=>{
    if(err){
      res.json({
        status:"1",
        msg:err.message
      })
    }else{
      if(doc){
        //cookieParser插件，保存cookie信息
        res.cookie("userId",doc.userId,{
          path:'/',
          maxAge:1000*60*60
        });
        res.cookie("userName",doc.userName,{
          path:'/',
          maxAge:1000*60*60
        })
        //保存session信息，需用插件才生效
       // req.session.user=doc;

        res.json({
          status:"0",
          msg:"",
          result:{
            userName:doc.userName
          }
        })
      }else{
        res.json({
          status:"1",
          msg:"用户名或者密码错误",
          result:''
        })
      }
    }
  })

});

//登出接口
router.post('/logout', function(req, res, next) {
  res.cookie("userId","",{
    path:'/',
    maxAge:-1
  });
  res.cookie("userName","",{
    path:'/',
    maxAge:-1
  });

  res.json({
    status:"0",
    msg:"",
    result:""
  });
});

//判断用户是否登录
router.get("/checkLogin",function(req,res,next) {
  if(req.cookies.userId){
    res.json({
      status:'0',
      msg:'',
      result:{
        userName:req.cookies.userName||''
      }
    })
  }else{
    res.json({
      status:'10001',
      msg:'未登录',
      result:''
    })
  }
});

//查询当前用户购物车数据
router.get("/cartList",function(req,res,next){
  let userId=req.cookies.userId;
  User.findOne({userId:userId},(err,doc)=>{
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:""
      })
    }else{
      if(doc){
         res.json({
          status:"0",
          msg:"",
          result:doc.cartList
        })
      }
    }
  });
});

//购物车删除
router.post("/cartDel",function(req,res,next){
  let userId=req.cookies.userId;
  let productId=req.body.productId;

//$pull修饰符会删除掉组合中符合条件的元素
  User.update({
    "userId":userId
  },{
    $pull:{
      'cartList':{
        'productId':productId
      }
    }
  },(err,doc)=>{
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:""
      })
    }else{
      if(doc){
         res.json({
          status:"0",
          msg:"",
          result:"success"
        })
      }
    }
  });
});

//购物车商品数量加减以及选中状态改变
router.post("/cartEdit",function(req,res,next){
  let userId=req.cookies.userId;
  let productId=req.body.productId;
  let productNum=req.body.productNum;
  let checked=req.body.checked;

  User.update({
    "userId":userId,
    "cartList.productId":productId
  },{
    "cartList.$.productNum":productNum,
    "cartList.$.checked":checked
  },(err,doc)=>{
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:""
      })
    }else{
      if(doc){
         res.json({
          status:"0",
          msg:"",
          result:"success"
        })
      }
    }
  });
});

//购物车全选
router.post("/cartEditCheckAll",function(req,res,next){
  let userId=req.cookies.userId;
  let checkAll=req.body.checkAll;

  User.findOne({userId:userId},(err,doc)=>{
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:""
      })
    }else{
      if(doc){
        doc.cartList.forEach((item)=>{
          item.checked=checkAll;
        })
        doc.save((err1,doc1)=>{
          if(err1){
            res.json({
              status:"1",
              msg:err.message,
              result:""
            })
          }else{
            if(doc1){
               res.json({
                status:"0",
                msg:"",
                result:"success"
              })
            }
          }
        })
      }
    }
  });
});

//查询当前用户地址数据
router.get("/addressList",function(req,res,next){
  let userId=req.cookies.userId;
  User.findOne({userId:userId},(err,doc)=>{
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:""
      })
    }else{
      if(doc){
         res.json({
          status:"0",
          msg:"",
          result:doc.addressList
        })
      }
    }
  });
});

//设置默认地址
router.post("/setDefault",function(req,res,next){
  let userId=req.cookies.userId;
  let addressId=req.body.addressId;

  User.findOne({userId:userId},(err,doc)=>{
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:""
      })
    }else{
      if(doc){
        doc.addressList.forEach((item)=>{
          if(item.addressId==addressId){
            item.isDefault=true;
          }else{
            item.isDefault=false;
          }
        })
        doc.save((err1,doc1)=>{
          if(err1){
            res.json({
              status:"1",
              msg:err.message,
              result:""
            })
          }else{
            if(doc1){
               res.json({
                status:"0",
                msg:"",
                result:""
              })
            }
          }
        })
      }
    }
  });
});

//地址删除
router.post("/addressDel",function(req,res,next){
  let userId=req.cookies.userId;
  let addressId=req.body.addressId;

//$pull修饰符会删除掉组合中符合条件的元素
  User.update({
    "userId":userId
  },{
    $pull:{
      'addressList':{
        'addressId':addressId
      }
    }
  },(err,doc)=>{
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:""
      })
    }else{
      if(doc){
         res.json({
          status:"0",
          msg:"",
          result:"success"
        })
      }
    }
  });
});

//订单生成、订单创建
router.post("/payMent",function(req,res,next){
  let userId=req.cookies.userId;
  let orderTotal=req.body.orderTotal;
  let addressId=req.body.addressId;

  User.findOne({userId:userId},(err,doc)=>{
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:""
      })
    }else{
      let address='',goodsList=[];
      //获取当前用户地址信息
      doc.addressList.forEach((item)=>{
        if(item.addressId==addressId){
          address=item
        }
      })
      //获取用户购买商品
      doc.cartList.filter((item)=>{
        if(item.checked){
          goodsList.push(item);
        }
      })

      let r1=Math.floor(Math.random()*10);
      let r2=Math.floor(Math.random()*10);
      let sysDate=new Date().Format('yyyyMMddhhmmss');
      let platform='822';//平台码

      let createDate=new Date().Format('yyyy-MM-dd hh:mm:ss');//订单创建日期
      let orderId=platform+r1+sysDate+r2;//订单ID


      //创建订单
      let order={
        orderId:orderId,
        orderTotal:orderTotal,
        addressInfo:address,
        goodsList:goodsList,
        orderStatus:'1',
        createData:createDate
      };

      doc.orderList.push(order);
      doc.save((err1,doc1)=>{
          if(err1){
            res.json({
              status:"1",
              msg:err.message,
              result:""
            })
          }else{
            if(doc1){
               res.json({
                status:"0",
                msg:"",
                result:{
                  orderId:order.orderId,
                  orderTotal:order.orderTotal
                }
              })
            }
          }
        })
    }
  })
});

//订单信息查询
router.get("/orderDetail",function(req,res,next){
  let userId=req.cookies.userId;
  let orderId=req.param("orderId");

  User.findOne({userId:userId},(err,userInfo)=>{
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:""
      })
    }else{
      if(userInfo){

        let orderList=userInfo.orderList;

        if(orderList.length>0){
          let orderTotal=0;
          orderList.forEach((item)=>{
            if(item.orderId==orderId){
              orderTotal=item.orderTotal;
            }
          })

          res.json({
            status:"0",
            msg:"",
            result:{
              orderId:orderId,
              orderTotal:orderTotal
            }
          })
        }else{
          res.json({
            status:"120001",
            msg:"此用户无订单信息",
            result:''
          })
        }
      }
    }
  });
});

//查询当前用户购物车商品数量
router.get("/getCartCount",function(req,res,next){
  let userId=req.cookies.userId;
  User.findOne({userId:userId},(err,doc)=>{
    if(err){
      res.json({
        status:"1",
        msg:err.message,
        result:""
      })
    }else{
      if(doc){
        let cartList=doc.cartList;
        let cartCount=0;
        cartList.map((item)=>{
          cartCount+=parseInt(item.productNum);
        })
         res.json({
          status:"0",
          msg:"",
          result:cartCount
        })
      }
    }
  });
});

module.exports = router;
