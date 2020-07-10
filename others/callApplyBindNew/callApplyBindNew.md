# call
- 改变函数this指向
- 执行函数
- ，分隔参数
```
function myCall(cxt, ...args) {
    cxt.fn = this
    return cxt.fn(...args)
}
Function.prototype.call = myCall 
```

# apply
- 改变函数this指向
- 执行函数
- 数组参数
```
function myApply(cxt, args) {
    cxt.fn = this
    return ctx.fn(args)
}
Function.prototype.myApply = myApply
```

# bind
- 改变函数this指向
- 数组参数
```
function myBind(cxt, args) {
    return function() {
        return myApply(cxt, args)
    }
}
Function.prototype.myBind = myBind
```

# new
- 创建一个对象（假设为obj）
- 对象__proto__属性赋值为构造函数原型（prototype）
- this赋值给obj
- 执行构造函数，如构造函数有对象(非null)类型返回，则返回该对象；否则返回obj
```
function myNew(constructor, ...args) {
    const obj = Object.create(constructor.prototype, ...args)
    const result = constructor.call(obj, ...args)
    result instanceof Object ? result : obj
}
```
