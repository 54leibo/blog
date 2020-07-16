# 7中JavaScript继承对比
该文章为高程的学习笔记

##### 1. 原型链式继承
```
function SupperType(name) {
    this.name = name
}
SupperType.prototype.getName = () => {
    return this.name
}

function SubType(name) {
    this.subName = name
}
SubType.prototype = new SupperType()
SubType.prototype.getSubName = () => {
    return this.subName
}
```
优点：没啥优点，只能说实现了基本的继承吧

缺点：父级构造函数没法传参；如果存在引用类型的属性，那可以在实例中改变，其它实例会被污染
```
function SupperType(name) {
    this.name = name
    this.arr = []
}
SupperType.prototype.getName = () => {
    return this.name
}

function SubType(name) {
    this.subName = name
}
SubType.prototype = new SupperType()
SubType.prototype.getSubName = () => {
    return this.subName
}

const instance1 = new SubType('小雷')
console.log(instance1.arr) // []
instance1.arr.push(1)
console.log(instance1.arr) // [1]
const instance2 = new SubType('小李')
console.log(instance2.arr) // [1], 被影响到了
```

##### 2. 借用构造函数
为了解决原型链继承存在的构造函数不能传参和引用类型属性污染的问题

引用类型属性放构造函数内
```
function SupperType(name) {
    this.name = name
    this.arr = []
}

function SubType(name, ...supperArgs) {
    this.subName = name
    SupperType.call(this, ...supperArgs)
}

const instance1 = new SubType('小雷', '小李')
instance1.arr.push(1)
console.log(instance1.arr) // [1]
const instance2 = new SubType('小荣', '小黄')
console.log(instance2.arr) // [] 没有被污染

优点：没有了引用类型属性污染问题；可以为父级构造函数传参
缺点：没有复用
```

##### 3. 组合式继承
```
function SupperType(name) {
    this.name = name
    this.arr = []
}
SupperType.prototype.getName = () => {
    return this.name
}

function SubType(name, ...supperArgs) {
    this.subName = name
    // 后面会再继承一次，但是根据原型链但是会被这里的覆盖
    SupperType.call(this, ...supperArgs)
}
// 这里会再继承一边SupperType中挂在this上的属性，但是被覆盖了
SubType.prototype = new SupperType()
SubType.prototype.Constructor = SubType
SubType.prototype.getSubName = () => {
    return this.subName
}

const instance1 = new SubType('小雷', '小李')
instance1.arr.push(1)
console.log(instance1.arr) // [1]
const instance2 = new SubType('小荣', '小黄')
console.log(instance2.arr) // [] 没有被污染

优点：解决构造函数传参问题；解决引用类型污染问题；可以复用
缺点：子类原型和父类原型都存在相同的父类构造函数中挂载到this的值
```

##### 4. 原型式继承
如果需要继承一个已经存在的对象，可以不用劳师动众用到构造函数实现继承

```
// 最初提出
function createObject(obj) {
    function Fn() {}
    Fn.prototype = obj
    return new Fn
}
var obj = {a: 123, arr: [1]}
var instance1 = createObject(obj)
var instance2 = createObject(obj)

// 形成标准
const obj = {a: 123, arr: [1]}
const obj = Object.create(obj, {
    a: {
        get() {},
        set() {},
        enumarable: true,
        configurable: true
    },
    arr: {
        value: [2], // 会覆盖原来定义的值
        writable: true,
        enumarable: true,
        configurable: true
    }
})

优点：简单
缺点：只适用于已经存在需要继承的对象的情况；只是对被传入对象的浅复制，如果被继承对象存在引用类型，同样能够在子类中被修改
```

##### 5. 寄生式继承
可以为其增加一些属性增强其能力

```
function createObject(obj) {
    function Fn() {}
    Fn.prototype = obj
    return new Fn
}
function createAnotherObject(obj) {
    const clone = createObject(obj) // 先完成继承
    clone.sayHi = () => {           // 功能增强
        return 'Hi'
    }
    
    return clone                    // 返回增强后对象
}

const obj = createAnotherObject(Function.prototype)
obj.sayHi() // 'Hi'

优点：简单；可以为增强一些无法直接改动的对象（比如内置对象：Function、Date等）
缺点：无法重用
```

##### 6. 寄生组合式继承
解决了组合继承父构造函数中挂载在this上的属性存在两份的问题

```
function SupperType(name) {
    this.name = name
    this.arr = []
}
SupperType.prototype.getName = () => {
    return this.name
}

function SubType(name, ...supperArgs) {
    this.subName = name
    // 后面会再继承一次，但是根据原型链但是会被这里的覆盖
    SupperType.call(this, ...supperArgs)
}
// 这里会再继承一边SupperType中挂在this上的属性，但是被覆盖了
SubType.prototype = Object.create(SupperType.prototype)
SubType.prototype.Constructor = SubType
SubType.prototype.getSubName = () => {
    return this.subName
}

const instance1 = new SubType('小雷', '小李')
instance1.arr.push(1)
console.log(instance1.arr) // [1]
const instance2 = new SubType('小荣', '小黄')
console.log(instance2.arr) // [] 没有被污染

优点：拥有组合继承的缺点，同时避免了组合继承的缺点
缺点：语法看起来相对复杂
```

##### 7. ES6继承(Class)
```
class SupperType {
    constructor(name) {
        this.name = name
        this.arr = []
    }
    getName() {
        return this.name
    }
}
class SubType extends SupperType {
    constructor(name, ...supperArgs) {
        super(supperArgs)
        this.subName = name
    }
    getSubName() {
        return this.subName
    }
}

const instance1 = new SubType('小雷', '小李')
instance1.arr.push(1)
console.log(instance1.arr) // [1]
const instance2 = new SubType('小荣', '小黄')
console.log(instance2.arr) // [] 没有被污染

优点：目前最完美的方式
缺点：有些观点认为js使用类继承并不是最佳复用方式，而更好的方式是行为委托
```