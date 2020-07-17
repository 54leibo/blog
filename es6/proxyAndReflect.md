# Proxy
proxy即代理的意思，接管了部分对对象的操作，是对Object.defineProperty(s)的改进

接管了哪些操作？一共 13 种。
- get(target, propKey, receiver)：拦截对象属性的读取，比如proxy.foo和proxy['foo']。
- set(target, propKey, value, receiver)：拦截对象属性的设置，比如proxy.foo = v或proxy['foo'] = v，返回一个布尔值。
- has(target, propKey)：拦截propKey in proxy的操作，返回一个布尔值。
- deleteProperty(target, propKey)：拦截delete proxy[propKey]的操作，返回一个布尔值。
- ownKeys(target)：拦截Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)、for...in循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而Object.keys()的返回结果仅包括目标对象自身的可遍历属性。
- getOwnPropertyDescriptor(target, propKey)：拦截Object.getOwnPropertyDescriptor(proxy, propKey)，返回属性的描述对象。
- defineProperty(target, propKey, propDesc)：拦截Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs)，返回一个布尔值。
- preventExtensions(target)：拦截Object.preventExtensions(proxy)，返回一个布尔值。
- getPrototypeOf(target)：拦截Object.getPrototypeOf(proxy)，返回一个对象。
- isExtensible(target)：拦截Object.isExtensible(proxy)，返回一个布尔值。
- setPrototypeOf(target, proto)：拦截Object.setPrototypeOf(proxy, proto)，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
- apply(target, object, args)：拦截 Proxy 实例作为函数调用的操作，比如proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)。
- construct(target, args)：拦截 Proxy 实例作为构造函数调用的操作，比如new proxy(...args)。

# Reflect
reflect设计解决的并不是单一的原因，而是对多方面的改进
1. 替代Object上的静态方法，并对某些方法改进
    ```
    Object.defineProperty => Reflect.defineProperty
   并且Object.defineProperty遇到不该扩展的对象时是报错，而Reflect.defineProperty是返回false更方便处理
    ```
2. 让对象操作函数化
    ```
    in: Reflect.has
    delete: Reflect.deleteProperty
    ```
3. 具有Proxy具有的方法，完成对象操作的默认行为（个人认为这是最主要目的，上面两个是附带目的）

Reflect的api，总共13个，和proxy完全一致
- Reflect.get(target, name, receiver)
- Reflect.set(target, name, value, receiver)
- Reflect.has(target, name)
- Reflect.deleteProperty(target, name)
- Reflect.ownKeys(target)
- Reflect.getOwnPropertyDescriptor(target, name)
- Reflect.defineProperty(target, name, desc)
- Reflect.preventExtensions(target)
- Reflect.getPrototypeOf(target)
- Reflect.isExtensible(target)
- Reflect.setPrototypeOf(target, prototype)
- Reflect.apply(target, thisArg, args)
- Reflect.construct(target, args)

###### 注意
- 以上是对阮一峰《ES6入门》Proxy和Reflect的学习笔记，附带个人理解
- [《ES6入门》--阮一峰](https://es6.ruanyifeng.com/#docs/proxy)
