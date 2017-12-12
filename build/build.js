'use strict'
//版本检查
require('./check-versions')()

//全局环境变量设置，设置版本为生产
process.env.NODE_ENV = 'production'

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')//路径处理
const chalk = require('chalk')
const webpack = require('webpack')//打包处理
const config = require('../config')//index.js省略
const webpackConfig = require('./webpack.prod.conf')//读取生产包配置

const spinner = ora('building for production...')//日志输出，loading
spinner.start()

//打包前删除之前构建文件
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
    //开始打包
  webpack(webpackConfig, function (err, stats) {
    spinner.stop()
    if (err) throw err
      //输出模式设置
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
