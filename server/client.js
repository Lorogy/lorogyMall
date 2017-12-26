//nodejs一般是服务端
//当调运第三方服务器的服务（接口），相对称之为客户端
//
//调运慕课网接口
//

let http=require('http')

http.get('http://www.imooc.com/u/card',(res)=>{
  let data=''
  //数据不断传输
  res.on("data",(chunk)=>{
    data+=chunk
  })

  //数据传输结束
  res.on("end",()=>{
    console.log(data)
  })
})