let user=require('./User.js')

console.log(`${user.sayHello()},I'm ${user.userName}.`)

let http=require('http')
let url=require('url')
let util=require('util')

/*let server=http.createServer((req,res)=>{
  res.statusCode=200
  res.setHeader("Content-Type","text/plain;charset=utf-8")
  res.end("Hello,Node.js")
})
server.listen(3000,'127.0.0.1',()=>{
  console.log("服务器已运行，请打开浏览器，输入地址：http://127.0.0.1:3000/可访问")
})*/

//链式调用
http.createServer((req,res)=>{
  res.statusCode=200

  res.setHeader("Content-Type","text/plain;charset=utf-8")
  
  console.log("url:"+req.url)//相对路径
  
  console.log("parse:"+url.parse(req.url))//object

  res.end(util.inspect(url.parse(req.url)))//展开object内容
}).listen(3000,'127.0.0.1',()=>{
  console.log("服务器已运行，请打开浏览器，输入地址：http://127.0.0.1:3000/可访问")
})