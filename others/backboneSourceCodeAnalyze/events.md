# 概述
- Backbone.Events为什么要实现自定义事件？我认为有以下几个方面：
  1. Model、Collection中内置绑定了很多事件，比如change、add在合适的时候这些事件会被自动触发，前端可以通过监听这些事件监听Model、collection的变化；
  2. 利用观察者模式，实现模块之间解耦。

# 具体
- 需要实现的API列表
  - on object.on(event, callback, [context])别名: bind，绑定事件，
    - 参数依次为：绑定的事件名（字符串，多个事件使用空格隔开）、事件触发回调、回调中this指向（可选）
  - off object.off([event], [callback], [context])别名: unbind，事件解除绑定，
    - 参数依次为：解除绑定的事件名（可选，字符串，多个事件使用空格隔开）、解除绑定的回调函数（可选）、回调中this指向（可选），参数为解除的限定条件，无参数解除所有事件
  - once object.once(event, callback, [context])，同on，回调执行一次后自动解除绑定
  - listenTo A.listenTo(B, event, callback) A对象为B对象绑定事件，
    - 参数依次为：A对象（操控绑定和解绑）、B对象（触发事件）、事件名称（字符串，多个事件名使用空格）、事件触发回调
  - stopListening A.stopListening([B], [event], [callback]) A对象为B对象解除事件绑定，
    - 参数依次为：A对象、B对象（可选）、事件名（可选）、回调（可选），从第二个参数开始为限定条件，没有参数是意为解除A控制的所有事件绑定
  - listenToOnce A.listenToOnce(B, event, callback) 参考once 和 listenTo
  - trigger object.trigger(event, [*args])，触发绑定的事件，
    - 参数依次为：要触发的事件名、传递绑定回调的参数（可以传递多个）
- 原理
  - 从 需要实现的API列表 可以看到
