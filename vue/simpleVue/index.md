代码快照
![代码快照](./codeShop.png)

实现思路
利用Object.defineProperty实现发布订阅模式，数据调用触发get收集依赖，数据设置触发set通知依赖更新。
Oberver: 处理数据。和defineReactive为数据实现响应式，并在数据的get中收集依赖，set中触发更新
Compiler: 处理视图数据渲染，事件绑定
Watcher: 存储某一个依赖的更新方法
Dep: 收集所有依赖，通知所有依赖更新


实现功能
- data深度遍历，实现所有嵌套对象的响应式
- 实现vm.set方法，将新增对象属性处理为响应式
- 数据绑定：支持{{}}和v-text两种方式
- 事件回调绑定：支持v-bind:click="xxx"和@click="xxx"两种方式
- 数据和方法被实例代理：即可以通过this.xxx访问实例选项data和methods中的属性
- 方法和钩子中this绑定到实例
