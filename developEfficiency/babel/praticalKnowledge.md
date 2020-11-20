# babel是什么
babel是一个工具链，主要用于将 ECMAScript 2015+ 版本的代码转换为向后兼容的 Javascript 语法，以便能够运行在当前和旧版本的浏览器或其它环境中

# babel能做哪些转换
- 语法转换：箭头函数、展开运算符
- 通过 Polyfill 方式在目标环境中添加缺失的特性（通过@babel/polyfill模块）：新增内置函数（Promise、Map、Set等）、新增静态方法（Array.from()等）、新增实例方法（[].include()）
- 源码转换：JSX

# babel有哪些核心概念
- core（@babel/core）：核心库，将 source code 转换为 target code：babel.transform("source code", optionsObject)
- 插件化（@babel/plugin-xxx）：所有的转换工作都是通过插件完成，开发者也可以开发自己的插件
- 插件 presets（@babel/presets-xx）：插件集合，包含的插件能够支持所有ES2015+的语法转换，避免重复配置一大推插件
    - @babel/presets-env：env 的核心目的是通过配置得知目标环境的特点，然后只做必要的转换。例如目标浏览器支持 es2015，那么 es2015 这个 preset 其实是不需要的，于是代码就可以小一点(一般转化后的代码总是更长)，构建时间也可以缩短一些。如果不写任何配置项，env 等价于 latest，也等价于 es2015 + es2016 + es2017 三个相加(不包含 stage-x 中的插件)。env 包含的插件列表维护在这里
    - 按需引入polyfill（解决全部引入包过大问题），但需要用到帮助函数的转换每个模块会注入（不是引入，注入是每个模块都一份重复代码）一份，具体配置见 polyfill按需引入
- polyfill（@babel/polyfill）：提供新增内置函数、新增静态方法、新增实例方法
    - 全部引入会导致引入包过大
    - 全局污染
- cli（@babel/cli）：命令行执行转换、可传递不同参数
- 配置化（.babelrc/.babel.config.js/loader等）：通过配置文件配置参数
- 一个特殊的插件（@babel/plugin-transform-runtime 搭配 @babel/runtime）：解决包过大问题，同时去除重复的帮助函数代码、解决全局污染问题，具体配置见 polyfill按需引入

# polyfill按需引入（[测试项目地址](https://github.com/54leibo/testCode/tree/main/learnBabel)）
```
// 方法一：全局引入（优点：包过大、全局污染）
// 方法二：按需引入（优点：解决包过大 缺点：帮助函数重复注入、全局污染）
{
    presets: [
        [
            "@babel/preset-env",
            {
                "useBuiltIn": "usage",
                "corejs": 3
            }
        ]
    ]
}

// 方法三：优化的按需引入（优点：解决包过大 缺点：全局污染）
{
    "presets": [
        [
            "@babel/preset-env",
            {
                "useBuiltIn": "usage",
                "corejs": 3
            }
        ]
    ],
    "plugins": ["@babel/plugin-transform-runtime"]
}

// 方法四：再优化的按需引入（优点：解决包过大问题、解决全局污染）
{
    "presets": [
        [
            "@babel/preset-env"
        ]
    ],
    "plugins": ["@babel/plugin-transform-runtime", {"corejs": 3}]
}
```

# 常用babel配置
```
// .babelrc
// 污染全局环境、引入（非注入）引入帮助函数，需安装@babel/pollyfill
{
    presets: [
        ["@babel/preset-env",{
            "corejs": 3
        }]
    ],
    plugins: ["@babel/plugin-transform-runtime"]
}

// 不污染全局环境、引入（非注入）引入帮助函数，需安装@babel/runtime
{
    presets: [
        ["@babel/preset-env"]
    ],
    plugins: ["@babel/plugin-transform-runtime",{
            "corejs": 3
        }]
}
```

# 怎样配置配置文件
- 常用配置文件名称：babel.config.ext/babelrc.ext
- 常用的扩展名：.json/.js
- 也可以放在 package.json 的 babel 字段下
- 常用：.babelrc/babel.config.js

# 参考
- https://www.jianshu.com/p/cbd48919a0cc
- https://www.cnblogs.com/sefaultment/p/11631314.html
- https://juejin.im/post/6844904008679686152#heading-11
- https://www.babeljs.cn/docs/index.html