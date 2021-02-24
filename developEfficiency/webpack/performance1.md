# 目录

## 打包速度衡量工具
## exclude/include 让 loader 只处理需要处理的文件
## cache-loader 缓存 loader 的处理结果
## HardSourceWebpackPlugin 模块中间缓存
## happypack 调用多进程打包
## noParse
## IgnorePlugin
## externals
## DllPlugin 和 DLLReferencePlugin
## 抽离公共代码
## webpack 内部优化

# 内容

## 打包速度衡量工具

- speed-measure-webpack-plugin

```
//webpack.config.js
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

const config = {
    //...webpack配置
}

module.exports = smp.wrap(config);

```

## exclude/include 让 loader 只处理需要处理的文件

- 针对每个 loader 设定，使用绝对路径，exclude 是排除，include 是包含，同时使用时 exclude 优先级高于 include

```
module.rules: [
            {
                test: /\.js[x]?$/,
                use: ['babel-loader'],
                include: [path.resolve(__dirname, 'src')]
            }
        ]
```

## cache-loader 缓存 loader 的处理结果

- 对耗时构建来说，第一次之后的构建速度有明显减少
- 缓存默认保持目录：node_modueles/.cache/cache-loader
- babel-loader 本身支持缓存

```
// cache-loader
module.rules: [
    {
        test: /\.jsx?$/,
        use: ['cache-loader','babel-loader']
    }
]
// babel-loader
module.rules: [
    {
        test: /\.jsx?$/,
        use: [{
            loader: 'babel-loader',
            options: {
                cacheDirectory: 'node_modules/.cache/babel-loader', // 默认是 false
            }
        }]
    }
]
```

## HardSourceWebpackPlugin 模块中间缓存

- 如遇到热更新失效，或者某些配置不生效等请参考官方文档

```
plugins: [
        new HardSourceWebpackPlugin()
    ]
```

## happypack 调用多进程打包

- 因为进程间通讯也有一定的耗时，所以只适合比较耗时的 loader，对于简单的 loader 则并没有必要性
- 处理流程为：把任务发送到不同的进程处理，处理完了把处理结果发送回来
- thread-loader 也能实现类似的功能，不过配置不太一样，可以查看官方文档使用
- TerserWebpackPlugin 压缩 JavaScript 时默认也会开始多进程

```
// 配置
const Happypack = require('happypack')
const cpus = os.cpus().length
{
    module.rules: [
        {
            test: /\.js[x]?$/,
            use: 'Happypack/loader?id=js',
            include: [path.resolve(__dirname, 'src')]
        },
        {
            test: /\.css$/,
            use: 'Happypack/loader?id=css',
            include: [
                path.resolve(__dirname, 'src'),
                path.resolve(__dirname, 'node_modules', 'bootstrap', 'dist')
            ]
        }
    ],
    plugins: [
        new Happypack({
            id: 'js', // 和rule中的id=js对应
            use: ['babel-loader'], // 将之前 rule 中的 loader 在此配置, 必须是数组
            threads: cpus - 1, // 模块开启的处理进程，默认是 cpu 内核数 - 1
        }),
        new Happypack({
            id: 'css', // 和rule中的id=css对应
            use: ['style-loader', 'css-loader','postcss-loader'],
        })
    ]
}

// postcss-loader 配置，需要增加 postcss.config.js，不然会报错
module.exports = {
    plugins: [
        require('autoprefixer')(),
    ]
}
```

## noParse

> 作用：1. 如果一些第三方模块没有 AMD/CommonJS 规范版本，可以使用 noParse 来标识这个模块，这样 Webpack 会引入这些模块，但是不进行转化和解析，从而提升 Webpack 的构建性能；2. 是 AMD/CommonJS 的模块，但是不需要转化和解析的也可以使用来加快构建速度

```
// 是一个正则或者是函数
module: {
        noParse: /jquery|lodash/
    }
```

## IgnorePlugin

> 作用：忽略第三方包指定内容，例如: moment (2.24.0 版本) 会将所有本地化内容（语言）和核心功能一起打包，我们就可以使用 IgnorePlugin 在打包时忽略本地化内容，使用时只引入需要用到的语言包

```
// webpack 配置
plugins: [
        //忽略 moment 下的 ./locale 目录
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
// 手动引入单个语言包
import moment from 'moment';
import 'moment/locale/zh-cn';// 手动引入
```

## externals

> 不参与打包的文件，但是需要通过 import/require 模块语法引入，实际引入位置为 html

```
// webpack 配置
externals: {
        //jquery通过script引入之后，全局中即有了 jQuery 变量
        'jquery': 'jQuery'
    }

// html 中引入
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <div id="root">root</div>
    <script src="http://libs.baidu.com/jquery/2.0.0/jquery.min.js"></script>
</body>
</html>

// jquery引入
import $ from ‘jQuery’
```

- 參考
  - [带你深度解锁 Webpack 系列(优化篇)](https://juejin.cn/post/6844904093463347208#heading-10)
  - [webpack externals 详解](https://www.tangshuang.net/3343.html)

## DllPlugin 和 DLLReferencePlugin

> 动态链接库，把很少更新的库作为打包成独立的包在代码执行时动态加载，其目的是减少源代码包体积并加快构建速度

```
// 单独打包 webpack 配置文件：webpack.config.dll.js
const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: {
        react: ['react', 'react-dom']
    },
    mode: 'production',
    output: {
        filename: '[name].dll.[hash:6].js',
        path: path.resolve(__dirname, 'dist', 'dll'),
        library: '[name]_dll' //暴露给外部使用
        //libraryTarget 指定如何暴露内容，缺省时就是 var
    },
    plugins: [
        new webpack.DllPlugin({
            //name和library一致
            name: '[name]_dll',
            path: path.resolve(__dirname, 'dist', 'dll', 'manifest.json') //manifest.json的生成路径
        })
    ]
}

// 设置命令：package.json
{
    "scripts": {
        "dev": "NODE_ENV=development webpack-dev-server",
        "build": "NODE_ENV=production webpack",
        "build:dll": "webpack --config webpack.config.dll.js"
    },
}

// 产出文件目录
dist
└── dll
    ├── manifest.json
    └── react.dll.9dcd9d.js

// 主打包文件配置 webpack.config.js
const webpack = require('webpack');
const path = require('path');
module.exports = {
    //...
    devServer: {
        contentBase: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new webpack.DllReferencePlugin({
            manifest: path.resolve(__dirname, 'dist', 'dll', 'manifest.json')
        }),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['**/*', '!dll', '!dll/**'] //不删除dll目录
        }),
        //...
    ]
}

// html引入：public/index.html
<script src="/dll/react.dll.9dcd9d.js"></script>
```

## 抽离公共代码

> 抽离公共代码的目的是为了利用缓存

```
// webpack.config.js
optimization: {
        splitChunks: {//分割代码块
            cacheGroups: {
                vendor: {
                    //第三方依赖
                    priority: 1, //设置优先级，首先抽离第三方模块
                    name: 'vendor',
                    test: /node_modules/,
                    chunks: 'initial',
                    minSize: 0,
                    minChunks: 1 //最少引入了1次
                },
                //缓存组
                common: {
                    //公共模块
                    chunks: 'initial',
                    name: 'common',
                    minSize: 100, //大小超过100个字节
                    minChunks: 3 //最少引入了3次
                }
            }
        }
    }

// 将 vendor 拆分成更小的包
optimization: {
    concatenateModules: false,
    splitChunks: {//分割代码块
      maxInitialRequests:6, //默认是5
      cacheGroups: {
        vendor: {
          //第三方依赖
          priority: 1,
          name: 'vendor',
          test: /node_modules/,
          chunks: 'initial',
          minSize: 100,
          minChunks: 1 // 重复引入了几次
        },
        'lottie-web': {
          name: "lottie-web", // 单独将 react-lottie 拆包
          priority: 5, // 权重需大于`vendor`
          test: /[\/]node_modules[\/]lottie-web[\/]/,
          chunks: 'initial',
          minSize: 100,
          minChunks: 1 //重复引入了几次
        },
        //...
      }
    },
  },
```

## webpack 内部优化

- tree-shaking：打包时将没有用到的代码删除，仅使用 ES6 模块时有效

```
// math.js
const add = (a, b) => {
    console.log('aaaaaa')
    return a + b;
}

const minus = (a, b) => {
    console.log('bbbbbb')
    return a - b;
}

export {
    add,
    minus
}

// index.js
import {add, minus} from './math';
add(2,3);
// 以上代码 minus 在打包时会被删除
```

- scope hosting 作用域提升，仅使用 ES6 模块时有效
  > webpack 中的作用于提升，是指直接把模块注入到另一个模块中，减少函数的创建和调用

```
// webpack.config.js 配置
plugins: [new webpack.optimize.ModuleConcatenationPlugin()]
```

- 引用
  - [webpack 的 scope hoisting 是什么？](https://ssshooter.com/2019-02-20-webpack-scope-hoisting/)
  - [带你深度解锁Webpack系列(优化篇)](https://juejin.cn/post/6844904093463347208#heading-16)
