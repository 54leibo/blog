# 禁用Cookie时怎样使用Session

## 默认SESSION配置

在默认的JSP、PHP配置中，SessionID是需要存储在Cookie中的，默认Cookie名为：
- PHPSESSIONID
- JSESSIONID

以下以PHP为例：
你第一次访问网站时，
- 服务端脚本中开启了Sessionsession_start();，
- 服务器会生成一个不重复的 SESSIONID 的文件session_id();，比如在/var/lib/php/session目录
- 并将返回(Response)如下的HTTP头 Set-Cookie:PHPSESSIONID=xxxxxxx
- 客户端接收到Set-Cookie的头，将PHPSESSIONID写入cookie
- 当你第二次访问页面时，所有Cookie会附带的请求头(Request)发送给服务器端
- 服务器识别PHPSESSIONID这个cookie，然后去session目录查找对应session文件，
- 找到这个session文件后，检查是否过期，如果没有过期，去读取Session文件中的配置；如果已经过期，清空其中的配置
- 如果客户端禁用了Cookie，那PHPSESSIONID都无法写入客户端，Session还能用？

答案显而易见：不能

并且服务端因为没有得到PHPSESSIONID的cookie，会不停的生成session_id文件

## 取巧传递session_id

但是这难不倒服务端程序，聪明的程序员想到，如果一个Cookie都没接收到，基本上可以预判客户端禁用了Cookie，那将session_id附带在每个网址后面(包括POST)，
比如：

GET http://www.xx.com/index.php?session_id=xxxxx
POST http://www.xx.com/post.php?session_id=xxxxx
然后在每个页面的开头使用session_id($_GET['session_id'])，来强制指定当前session_id

这样，答案就变成了：能

聪明的你肯定想到，那将这个网站发送给别人，那么他将会以你的身份登录并做所有的事情
（目前很多订阅公众号就将openid附带在网址后面，这是同样的漏洞）。

其实不仅仅如此，cookie也可以被盗用，比如XSS注入，通过XSS漏洞获取大量的Cookie，也就是控制了大量的用户，腾讯有专门的XSS漏洞扫描机制，因为大量的QQ盗用，发广告就是因为XSS漏洞

所以Laravel等框架中，内部实现了Session的所有逻辑，并将PHPSESSIONID设置为httponly并加密，这样，前端JS就无法读取和修改这些敏感信息，降低了被盗用的风险。

- [截取自[面试经典问题：Cookie禁用了，Session还能用吗？]member的回答](https://segmentfault.com/q/1010000007715137)

# 面试简答
用url把SessionId传递给后台