# 目录

## 自动注入全局变量

## 动态加载

## 多入口应用

## 文件解析控制

## 区分开发和生产环境配置

## 定义环境变量

## 数据 mock

## sourcemap

## 打包前清除 dist 目录

## copy 不需要 webpack 处理的资源，仅处理资源路径不对资源本身处理

## 自动注入全局变量

```
// 默认查找 ./ 和 node_modules 下的路径，webpack 会为使用到 相应全局变量的模块动态注入
plugins: [
    new webpack.ProvidePlugin({
        React: 'react',
        Component: ['react', 'Component'],
        Vue: ['vue/dist/vue.esm.js', 'default'],
        $: 'jquery',
        _map: ['lodash', 'map']
    })
]
```

## 动态加载

```
// 动态引入的内容会被当作新的入口一样生成新的文件，代码执行到时再加载进来
document.getElementById('btn').onclick = function() {
    import('./handle').then(fn => fn.default());
}
```

## 多入口应用

```
{
    entry: {
        index: './src/index.js',
        login: './src/login.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[hash:6].js'
    },
    //...
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html', // 打包后的文件名, 默认为 index.html
            chunks: ['index'], // 不限制会把 index.xx.js 和 login.xx.js 都加进去
        }),
        new HtmlWebpackPlugin({
            template: './public/login.html',
            filename: 'login.html', // 打包后的文件名, 默认为 index.html
            chunks: ['index'], // 不限制会把 index.xx.js 和 login.xx.js 都加进去
        }),
    ]
}
```

## 文件解析控制

```
// 解析顺序（模块路径，即非相对和绝对路径）
resolve: {
    modules: ['./src/components', 'node_modules'], // 查找模块相对项目根目录拼接以上路径查找，顺序是从左往右
    alias: {
        @util: path.resolve(__dirname, 'src/utilities/'),
        @tpls: path.resolve(__dirname, 'src/templates/'),
    }, // 别名, 路径 'src/utilities/api.js' 可以这样简化引入 import api from ‘@util/api’
    mainFields: ['browser', 'main'], // 包入口字段，目前配置为默认，配合package.json查找包入口
}
```

## 区分开发和生产环境配置

- webpack-merge 合并不同环境配置

```
// webpack.base.js 定义公共的配置
// webpack.dev.js：定义开发环境的配置
// webpack.prod.js：定义生产环境的配置

const merge = require('webpack-merge');
merge({
    devtool: 'cheap-module-eval-source-map',
    module: {
        rules: [
            {a: 1}
        ]
    },
    plugins: [1,2,3]
}, {
    devtool: 'none',
    mode: "production",
    module: {
        rules: [
            {a: 2},
            {b: 1}
        ]
    },
    plugins: [4,5,6],
});
// 合并后的结果为
{
    devtool: 'none',
    mode: "production",
    module: {
        rules: [
            {a: 1},
            {a: 2},
            {b: 1}
        ]
    },
    plugins: [1,2,3,4,5,6]
}
```

## 定义环境变量

```
// DefinePlugin 中的每个键，是一个标识符
// 如果 value 是一个字符串，会被当做 code 片段
// 如果 value 不是一个字符串，会被stringify
// 如果 value 是一个对象，正常对象定义即可
// 如果 key 中有 typeof，它只针对 typeof 调用定义

//webpack.config.dev.js
const webpack = require('webpack');
module.exports = {
    plugins: [
        new webpack.DefinePlugin({
            DEV: JSON.stringify('dev'), //字符串
            FLAG: 'true' //FLAG 是个布尔类型
        })
    ]
}
```

## 数据 mock

```
// 1. 利用 devServer 提供的接口服务
// 接收数据请求
devServer: {
    before(app) {
        app.get('/user', (req, res) => {
            res.json({name: '刘小夕'})
        })
    }
}

// 使用 api
fetch("user")
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(err => console.log(err));

// 2. 利用 devServer 提供的接口服务 + mock-api 包
// /mock/mocker.js
module.exports = {
    'GET /user': {name: '刘小夕'},
    'POST /login/account': (req, res) => {
        const { password, username } = req.body
        if (password === '888888' && username === 'admin') {
            return res.send({
                status: 'ok',
                code: 0,
                token: 'sdfsdfsdfdsf',
                data: { id: 1, name: '刘小夕' }
            })
        } else {
            return res.send({ status: 'error', code: 403 })
        }
    }
}
// webpack.config.js
const apiMocker = require('mocker-api');
devServer: {
    before(app){
        apiMocker(app, path.resolve('./mock/mocker.js'))
    }
}
```

## sourcemap

```
// 开发环境 cheap-module-eval-source-map，生产环境 source-map
devtool: 'cheap-module-eval-source-map'
```

## 打包前清除 dist 目录

```
plugins: [
    new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns:['**/*', '!dll', '!dll/**'] // 不删除 dll 目录下的文件
    })
]
```

## copy 不需要 webpack 处理的资源，仅处理资源路径不对资源本身处理

```
plugins: [
    new CopyWebpackPlugin(
    [
        {
            from: 'public/js/*.js',
            to: path.resolve(__dirname, 'dist', 'js'),
            flatten: true,
        }
    ],
    {
        ignore: ['other.js']
    })
]
```

- 参考
  - [带你深度解锁Webpack系列(基础篇)](https://juejin.cn/post/6844904079219490830)