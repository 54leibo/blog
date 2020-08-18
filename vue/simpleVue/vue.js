// Observer: make data responsible
// notice: 
// 1. deep walk for obj value
// 2. special process for add/delete value
function defineReactive(obj, key, value) {
    // collect all deps
    let deps = new Dep()
    Object.defineProperty(obj, key, {
        get() {
            // collect special key deps
            if (Dep.target) {
                deps.add()
            }
            return value
        },
        set(newValue) {
            console.log('set', key, newValue)
            value = newValue
            // must be after value update
            deps.nodtify()
            new Observer(newValue)
        }
    })
}
class Observer {
    constructor(obj) {
        this.walk(obj)
    }
    walk(obj) {
        if (typeof obj !== 'object') {
            return
        }
        Object.keys(obj).forEach(key => {
            defineReactive(obj, key, obj[key])
            new Observer(obj[key])
        })
    }
}
function set(obj, key, value) {
    defineReactive(obj, key, value)
}

// Watcher: connect data with template
class Watcher {
    constructor(vm, key, update) {
        this.update = update

        Dep.target = this
        vm[key]
        delete Dep.target
    }
}

// Compiler: convet template(Interpolations(text/html/attributes/expression)/Directives/Shorthand(v-bind/v-on)) to functions
class Compiler {
    constructor(vm) {
        this.vm = vm
        this.root = Compiler.getInnerHtml(vm.el) // unsupport template for the moment
        this.walkElements(this.root)
    }
    static getInnerHtml(el) {
        if (typeof el === 'string') {
            return document.getElementById(el.slice(1))
        }
        return el
    }
    walkElements(el) {
        if (el.nodeType !== 1) {
            return
        }
        const children = el.children
        if (children && children.length) {
            Array.from(children).forEach(childEl => this.walkElements(childEl))
        } else {
            this.transform(el)
        }
    }
    transform(el) {
        const text = el.textContent
        const attrs = el.attributes // {id: {}, length: 1}

        // exp: {{name}}, Just think about the simple case for now
        const reg = /\{\{([^\{\{\}\}]*)\}\}/ig
        const key = text.replace(reg, '$1')
        if (key) {
            this.text(el, key)
        }

        Array.from(attrs).forEach(attr => {

            // event bind
            const attrName = attr.name
            const attrVal = attr.value
            if (this.isEventBind(attrName)) {
                let eventName
                if(this.isEventBindAbbreviation(attrName)) {
                    eventName = attrName.slice(1) // @click="xxx"
                } else {
                    eventName = attrName.slice(7) // v-bind:click="xxx"
                }

                this.bind(el, eventName, attrVal)
            // directive
            } else if (this.isDirective(attrName)) {
                const nameSimplify = attrName.slice(2)
                if (typeof this[nameSimplify] === 'function') {
                    this[nameSimplify](el, attrVal)
                }
            }
        })
    }
    isDirective(name) {
        return name.indexOf('v-') !== -1
    }
    isEventBind(name) {
        return name.indexOf('v-bind') !== -1 || this.isEventBindAbbreviation(name)
    }
    isEventBindAbbreviation(name) {
        return name.indexOf('@') !== -1
    }
    text(el, key) {
        this.update('text', el, key)
    }
    textUpdater(el, key) {
        el.textContent = this.vm[key]
    }
    bind(el, eventName, cbName) {
        el.addEventListener(eventName, this.vm[cbName].bind(this.vm))
    }
    update(type, el, key) {
        const updater = this[`${type}Updater`]
        typeof updater === 'function' && updater.call(this, el, key)

        new Watcher(this.vm, key, updater.bind(this, el, key))
    }
}

function proxy(vm, source) {
    Object.keys(source).forEach(key => {
        Object.defineProperty(vm, key, {
            get() {
                return source[key]
            },
            set(newVal) {
                source[key] = newVal
            }
        })
    })
}

// Dep: collect and notify dependencies
class Dep {
    constructor() {
        this.deps = []
    }
    nodtify() {
        this.deps.forEach(watcher => watcher.update())
    }
    add() {
        this.deps.push(Dep.target)
    }
}

const lifecycleHooks = ['beforeCreate', 'created', 'beforeMount', 'mounted',
    'beforeUpdate', 'updated', 'beforeDestroyed', 'destroyed']

// Vue
class Vue {
    constructor(options) {
        this.el = options.el
        this.$data = options.data
        this.$methods = options.methods

        // bind this
        lifecycleHooks.forEach(lifecycleHook => {
            if (typeof options[lifecycleHook] === 'function') {
                options[lifecycleHook] = options[lifecycleHook].bind(this)
            }
        })

        new Observer(this.$data)
        proxy(this, this.$data)
        proxy(this, this.$methods)

        new Compiler(this)

        // simple process
        options.created()
    }
    set() {
        return set
    }
}

window.Vue = Vue
// export default Vue