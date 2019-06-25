能讲清楚，才是真的学会了

[四种常见web攻击](https://zhuanlan.zhihu.com/p/23309154)

# websocket系列
- [api介绍](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket#Ready_state_constants)
- [基本使用案例](https://www.html5rocks.com/zh/tutorials/websockets/basics/)

[REST和RESTFUL](https://www.zhihu.com/question/28557115)

# ArrayBuffer 和其它编码形式的转换
- ArrayBuffer <=> String: 
```
const _arrayBufferToString = arrayBuffer => 
    String.fromCharCode(...new Uint16Array(arrayBuffer))

const _stringToArrayBuffer = str => 
    Uint16Array.from(str, c => c.charCodeAt(0)).buffer

// example
const str = '123'
const buf = _stringToArrayBuffer(str)
console.log(str, _arrayBufferToString(buf))
```
- ArrayBuffer <=> Base64
```
const _arrayBufferToBase64 = arrayBuffer => 
    btoa(String.fromCharCode(...new Uint16Array(arrayBuffer)))

const _base64ToArrayBuffer = base64 => 
    Uint16Array.from(atob(base64), c => c.charCodeAt(0)).buffer
    
// example
const base64 = window.btoa('123')
const buf = _base64ToArrayBuffer(base64)
console.log(base64, _arrayBufferToBase64(buf))
```
- ArrayBuffer <=> Hex
```
const _arrayBufferToHex = (arrayBuffer) => 
    Array.prototype.map.call(new Uint16Array(arrayBuffer), x => ('00' + x.toString(16)).slice(-2)).join('')

const _hexToArrayBuffer = (str) => {
    const len = str.length
    const arrayBuffer = new ArrayBuffer(len)
    const uint16 = new Uint16Array(arrayBuffer)
    let b;
    
    for (let i=0, j=0; i<len; i+=2) {
        b = parseInt(str.substring(i, i+2), 16)
        uint16[j++] = b
    }
    
    return arrayBuffer;
}

// example
const hex = "39b2abc192db9bc9175de7e5f9e7ef08"
const buffer = _hexToArrayBuffer(hex);
console.log(hex, _arrayBufferToHex(buffer), hex === _arrayBufferToHex(buffer))
```
