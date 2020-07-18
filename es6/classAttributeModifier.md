面向对象编程一个非常重要的特性就是封装，封装的目的是只暴露想要暴露的属性和方法，其余的属性和方法都不能被访问到

本文介绍四种属性/方法修饰符/关键字：static/public/protected/private

##### static
```
class SuperType {
    static superName = 1;
    findSuperName () {
        return SuperType.superName
    }
}
class SubType extends SuperType {
    
}
console.log(SuperType.superName) // 1
console.log((new SuperType()).findSuperName()) // 1
console.log(SubType.superName) // 1
//1. 改变父类静态属性的值，子类会跟着改变
SuperType.superName = 11
console.log(SuperType.superName) // 11
console.log(SubType.superName) // 11
//2. 改变子类静态属性的值，父类不会改变
SubType.superName = 12
console.log(SuperType.superName) // 11
console.log(SubType.superName) // 12
// 为什么会出现1、2这样的现象，打印(console.dir(SubType))SubType，发现SubType.__proto__(SubType也是一个对象
，可以设置prototype属性) === SupperType，根据原型链查找规则，以上现象完美解释，同时也感受的JavaScript的灵活，以及class就是一个语法糖这句话
console.dir(SubType)
```
注: static 不能声明name，会提示name是只读变量，因为name构造函数预置的静态属性

##### public（该修饰符是默认的可以省略）
```
class SuperType {
    superName = 1;
    findSuperName () {
        return this.superName
    }
}
class SubType extends SuperType {
    
}

const instance = new SubType()
instsance.superName // 1
```

##### protected
```
class SuperType {
    _superName = 1;
    findSuperName () {
        return this._superName
    }
}
class SubType extends SuperType {
    
}

const instance = new SubType()
instsance._superName // 1
```

##### private
```
class SuperType {
    #superName = 1;
    findSuperName () {
        return this.#superName
    }
}
class SubType extends SuperType {
    findSuperName() {
        this.#superName
    }
}

const insSuper = new SuperType()
const insSub = new SubType()

insSuper.#superName // Uncaught SyntaxError: Private field '#superName' must be declared in an enclosing class
insSuper.findSuperName() // 1
insSub.#superName // Uncaught SyntaxError: Private field '#superName' must be declared in an enclosing class
insSub.findSuperName() // Uncaught SyntaxError: Private field '#superName' must be declared in an enclosing class
```

关键字 | 类本身 | 类的方法 | 类的实例 | 子类 | 子类方法 | 子类的实例
---|---|---|---|---|---|---
static | + | - | - | + | - | -
public | - | + | + | - | + | +
protected | - | + | - | - | + | -
private | - | + | - | - | - | -

以上表格简单总结下static就是挂载到类上的属性/方法（以下简称为属性），public是最开放的，
protected其次，private权限最严格，public => protected => private 前一级访问权限包
含后一级.这里的权限有些并不是强制的只是最佳实践，比如：static可以从任何地方访问到，
protected目前通过加_前缀实现只是一种共识没有语言层面的权限限制，private通过加前
缀#实现目前还是提议阶段浏览器支持较低

###### 参考
- [ES6入门](https://es6.ruanyifeng.com/#docs/class#%E7%A7%81%E6%9C%89%E6%96%B9%E6%B3%95%E5%92%8C%E7%A7%81%E6%9C%89%E5%B1%9E%E6%80%A7)
- [现代 JavaScript 教程之私有的和受保护的属性和方法](https://zh.javascript.info/private-protected-properties-methods)