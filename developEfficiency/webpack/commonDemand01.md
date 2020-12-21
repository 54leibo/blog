# 目录
## 基础配置
## JavaScript 处理
## CSS 处理
## 图片、字体处理
## html 处理
## mode 配置
## 开发服务器

# 内容
## 基础配置

```
// webpack.config.js
module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'), // 必须是绝对路径
        filename: 'bundle.[hash:6].js',
        publicPath: '/' // 通常是CDN地址
    },
    module: {
        rules: []
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: 'index.html', // 打包后的文件名
        }),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns:['**/*', '!dll', '!dll/**'] // 不删除dll目录下的文件
        })
    ],
}
```

## JavaScript 处理

- 预处理语言转换：
- 适配低版本浏览器：babel-loader

```
// weback.config.js rules
module.rules: [
    {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
    }
]

// .babelrc
{
    "presets": [
        [
            "@babel/preset-env"
        ]
    ],
    "plugins": ["@babel/plugin-transform-runtime", {"corejs": 3}]
}

// .browserlistrc
> 0.25%
not dead
```

## CSS 处理

- 预处理语言转换：less-loader、sass-loader、stylus-loader
- @import、资源路径处理：css-loader
- 注入到 html 页面：style-loader
- 适配低版本浏览器 - 加前缀：postcss-loader
- 提取到单独的 css 文件

```
// 以scss为例
modules.rules: [
    {
        test: /\.(sc|c)ss$/,
        use: [
            'style-loader',
            'css-loader',
            {
                loader: 'postcss-loader',
                options: {
                    plugins() {
                        return [
                            require('autoprefixer')()
                        ]
                    }
                }
            },
            'sass-loader',
        ],
        exclude: /node_modules/,
    }
]

// 提取css: mini-css-extract-plugin（无压缩功能）, 压缩：optimize-css-assets-webpack-plugin
// 热更新：webpack.HotModuleReplacementPlugin
module.rules: [
    {
        test: /\.(sc|c)ss$/,
        use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        hmr: true, // 热更新配置项
                        reloadAll: true, // 热更新失效时的降级处理
                    },
                },
                'css-loader',
                {
                    loader: 'postcss-loader',
                    options: {
                        plugins() {
                            return [
                                require('autoprefixer')()
                            ]
                        }
                    }
                },
                'sass-loader',
            ],
        exclude: /node_modules/,
    }
]

plugins: [
    new webpack.HotModuleReplacementPlugin(), // 热更新
    new OptimizeCssPlugin(), // 压缩，此 plugin 也可以放在 optimization 里，参考 v4 插件文档
    new MiniCssExtractPlugin({
        filename: 'css/[name].css'
        // 个人习惯将css文件放在单独目录下
        // publicPath:'../'   //如果你的output的publicPath配置的是 './' 这种相对路径，那么如果将css文件放在单独目录下，记得在这里指定一下publicPath
    })
]
```

## 图片、字体处理

- 路径处理、小图片转 base64: url-loader
- html 中图片处理：html-withimg-loader

```
// 处理资源路径、小图片转 base64
module.rules: [
    {
        test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/,
        use: [
            {
                loader: 'url-loader',
                options: {
                    limit: 10240, // 10K
                    esModule: false,
                },
            },
        ],
        exclude: /node_modules/
    }
]

// html 中图片引入处理，会压缩 html
module.rules: [
    {
        test: /\.html$/,
        use: 'html-withimg-loader',
    }
]
```

## html 处理

- 将生成的 JavaScript 自动添加到 html：html-webpack-plugin

```
// 指定 html 模版、指定打包后文件名、压缩、inject 配置、自动添加打包后的 js
plugins: [
    new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'index.html', // 打包后的文件名
        minify: {
            collapseWhitespace: true,
            removeComments: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
            useShortDoctype: true
        }, // 默认为true
        config: {
            title: 'home'
        }, // 使用<%= (htmlWebpackPlugin.options.config.title) %>
    })
]
```

## mode 配置

```
// 配置
mode: 'development' // 可选值 development、production、none

// 配置释义：
development:
process.env.NODE_ENV 的值设为 development
默认开启以下插件，充分利用了持久化缓存。参考基于 webpack 的持久化缓存方案
---
NamedChunksPlugin ：以名称固化 chunk id
NamedModulesPlugin ：以名称固化 module id

production:
process.env.NODE_ENV 的值设为 production
默认开启以下插件，其中 SideEffectsFlagPlugin 和 UglifyJsPlugin 用于 tree-shaking
---
FlagDependencyUsagePlugin ：编译时标记依赖
FlagIncludedChunksPlugin ：标记子chunks，防子chunks多次加载
ModuleConcatenationPlugin ：作用域提升(scope hosting),预编译功能,提升或者预编译所有模块到一个闭包中，提升代码在浏览器中的执行速度
NoEmitOnErrorsPlugin ：在输出阶段时，遇到编译错误跳过
OccurrenceOrderPlugin ：给经常使用的ids更短的值
SideEffectsFlagPlugin ：识别 package.json 或者 module.rules 的 sideEffects 标志（纯的 ES2015 模块)，安全地删除未用到的 export 导出
UglifyJsPlugin ：删除未引用代码，并压缩
```

## 开发服务器

- 热更新

```
// 1. 基本配置
devServer: {
    publicPath: '/',
    port: '3000', // 默认是8080
    quiet: fasle, // 默认不启用，来自 webpack 的错误或警告在控制台不可见，不建议开启
    inline: true, // 默认开启 inline 模式，如果设置为false, 开启 iframe 模式
    stats: "errors-only", // 终端中仅打印出 error，注意当启用了 quiet 或者是 noInfo 时，此属性不起作用
    overlay: false, // 默认不启用，在浏览器打开 遮罩层显示错误
    clientLogLevel: "silent", // 日志等级，当使用内联模式时，在浏览器的控制台将显示消息，如果你不喜欢看这些信息，可以将其设置为 silent
    compress: true // 是否启用 gzip 压缩
}
// 2. 热更新配置
devServer: {
    publicPath: '/',
    port: '3000', // 默认是8080
    quiet: fasle, // 默认不启用，来自 webpack 的错误或警告在控制台不可见，不建议开启
    inline: true, // 默认开启 inline 模式，如果设置为false, 开启 iframe 模式
    stats: "errors-only", // 终端中仅打印出 error，注意当启用了 quiet 或者是 noInfo 时，此属性不起作用
    overlay: false, // 默认不启用，在浏览器打开 遮罩层显示错误
    clientLogLevel: "silent", // 日志等级，当使用内联模式时，在浏览器的控制台将显示消息，如果你不喜欢看这些信息，可以将其设置为 silent
    compress: true, // 是否启用 gzip 压缩
    hot: true,
}
plugins: [
    new webpack.HotModuleReplacementPlugin()
]
// entry增加代码
if(module && module.hot) {
    module.hot.accept()
}
// 3. 配置代理服务器实现跨域
devServer: {
    proxy: {
        '/api': {
            target: 'xxx',
            pathRewrite: {
                '/api': ''
            }
        }
    }
}
```
- 参考
  - [带你深度解锁Webpack系列(基础篇)](https://juejin.cn/post/6844904079219490830)

