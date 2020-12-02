# **从输入 URL 到页面加载的过程及前端性能优化（网页的加载过程介绍）**

## 主要可分为 5 个过程

1. DNS 解析
2. TCP 连接
3. 客户端发送 HTTP 请求
4. 服务器处理请求并返回 HTTP 报文
5. 浏览器解析渲染页面

## 一、DNS 解析

通过 DNS 将域名解析成 IP 地址

-   如果浏览器有缓存，直接使用浏览器缓存，否则使用本机缓存。
-   如果本地没有，就向 DNS 域名服务器查询，查询到对应的 IP（中间经过路由，也有缓存网页的加载过程）。

## 二、TCP 连接

HTTP 协议是使用 TCP 作为其传输层协议的，当 TCP 出现瓶颈时，HTTP 也会受到影响。TCP 连接即通常所知的三次握手。

-   tcp/ip 的并发限制：浏览器对同一域名下并发的 tcp 连接是有限制的（2-10 个不等）;当到了 http2.0 的时候，一个 tcp/ip 请求就可以请求多个资源了
-   get 和 post 请求的区别

    -   get 请求时，浏览器会把 headers 和 data 一起发送出去，服务器响应 200（返回数据），产生一个 tcp 数据包；
    -   post 请求时，浏览器会先发送 headers，服务器响应 100 continue，浏览器再发送 data，服务器响应 200，产生两个数据包。

> **https**

https 与 http 的区别就是：**在请求前，会建立 ssl 链接，确保接下来的通信都是加密的，无法被轻易截取分析**
一般来说，将网站升级成 https，需要后端支持（后端需要申请证书等）

## 三、客户端发送 HTTP 请求

### http 报文结构

HTTP 请求报文一般包括通用头部，请求/响应头部，请求/响应体。

-   通用头部包括下面几个：

```
Request Url: 请求的web服务器地址

Request Method: 请求方式
（Get、POST、OPTIONS、PUT、HEAD、DELETE、CONNECT、TRACE）

Status Code: 请求的返回状态码，如200代表成功

Remote Address: 请求的远程服务器地址（会转为IP）
```

这里面最常用的就是状态码，大部分接口的状态的都可以通过状态码来判断：
![HTTP STATUS](https://image-static.segmentfault.com/266/525/2665256483-5aa5cafd4a7af_articlex "HTTP STATUS")

-   部分常用的请求头部如下：

```
Accept: 接收类型，表示浏览器支持的MIME类型（对标服务端返回的Content-Type）
Accept-Encoding：浏览器支持的压缩类型,如gzip等,超出类型不能接收
Content-Type：客户端发送出去实体内容的类型
Cache-Control: 指定请求和响应遵循的缓存机制，如no-cache
If-Modified-Since：对应服务端的Last-Modified，用来匹配看文件是否变动，只能精确到1s之内，http1.0中
Expires：缓存控制，在这个时间内不会请求，直接使用缓存，http1.0，而且是服务端时间
Max-age：代表资源在本地缓存多少秒，有效时间内不会请求，而是使用缓存，http1.1中
If-None-Match：对应服务端的ETag，用来匹配文件内容是否改变（非常精确），http1.1中
Cookie: 有cookie并且同域访问时会自动带上
Connection: 当浏览器与服务器通信时对于长连接如何进行处理,如keep-alive
Host：请求的服务器URL
Origin：最初的请求是从哪里发起的（只会精确到端口）,Origin比Referer更尊重隐私
Referer：该页面的来源URL(适用于所有类型的请求，会精确到详细页面地址，csrf拦截常用到这个字段)
User-Agent：用户客户端的一些必要信息，如UA头部等
```

-   响应头部一般与请求头部对应，如请求头部的 Accept 要和响应头部的 Content-Type 匹配，否则会报错。常用的如下：

```
Access-Control-Allow-Headers: 服务器端允许的请求Headers
Access-Control-Allow-Methods: 服务器端允许的请求方法
Access-Control-Allow-Origin: 服务器端允许的请求Origin头部（譬如为*）
Content-Type：服务端返回的实体内容的类型
Date：数据从服务器发送的时间
Cache-Control：告诉浏览器或其他客户，什么环境可以安全的缓存文档
Last-Modified：请求资源的最后修改时间
Expires：应该在什么时候认为文档已经过期,从而不再缓存它
Max-age：客户端的本地资源应该缓存多少秒，开启了Cache-Control后有效
ETag：请求变量的实体标签的当前值
Set-Cookie：设置和页面关联的cookie，服务器通过这个头部把cookie传给客户端
Keep-Alive：如果客户端有keep-alive，服务端也会有响应（如timeout=38）
Server：服务器的一些相关信息
```

-   http 请求除了上述两个，还有请求实体。一般来说，请求实体中会将一些需要的参数都放入，如 post 请求中常用的 formData 的数据。对于现在的接口来说，请求实体通常就是需要发送的信息的 json 格式。

## 四、服务器处理请求并返回 HTTP 报文

> 主要是后台内容，不作描述

## 五、浏览器解析渲染页面

![Html_render](https://image-static.segmentfault.com/137/309/1373095523-5a658fc12f1fd_articlex)

浏览器内核拿到内容后，渲染步骤大致可以分为以下几步

1. 解析 html，构建 DOM 树
2. 解析 CSS，生存 CSS 规则树
3. 合并 DOM 树和 CSS 规则树，生成 render 树
4. 布局 render 树（layout/reflow），负责各元素尺寸、位置的计算
5. 绘制 render 树（paint），绘制页面像素信息
6. 浏览器会将各层的信息发送给 GPU，GPU 会将各层合成（composite），显示在屏幕上

#### HTML 解析，构建 DOM

解析 HTML 到构建出 DOM 的过程可以简述如下：

> Bytes -> characters -> tokens -> nodes -> DOM

```html
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="style.css" rel="stylesheet" />
        <title>Critical Path</title>
    </head>
    <body>
        <p>Hello <span>web performance</span> students!</p>
        <div><img src="awesome-photo.jpg" /></div>
    </body>
</html>
```

![](https://image-static.segmentfault.com/236/309/2363096142-5aa5cafc74a50_articlex)

当中比较重要的几步：

1. Conversion 转换： 浏览器将获得的 HTML 内容（Bytes）基于它的编码转换为单个字符
2. Tokenizing 分词： 浏览器按照 HTML 规范保准将这些字符转换为不同的标记 token，每个 token 都有自己独特的含义及规则集
3. Lexing 词法分析： 分词的结果是得到一堆的 token，此时把他们转换为对象，这些对象分别定义他们的属性和规则
4. DOM 构建： 因为 HTML 标记定义的就是不同标签之间的关系，这个关系就像是一个树形结构一样，例如：body 对象的父节点就是 HTML 对象，然后段略 p 对象的父节点就是 body 对象

#### 生成 CSS 规则树

和 HTML 解析类似，CSS 规则树的生成过程主要如下：

> Bytes -> characters -> tokens -> nodes -> CSSOM

#### 构建渲染树

一般来说，渲染树和 DOM 树是相对应的，但不是严格意义上的一一对应，比如有些 display: none 的标签以及 head 这种标签都不会插入的渲染树中

#### 渲染

![](https://image-static.segmentfault.com/588/361/588361506-5aa5cafbe158d_articlex)

渲染的四个重要步骤：

1. 计算 CSS 样式
2. 构建渲染树
3. 布局，主要定位坐标和大小，是否换行，各种 position overflow z-index 属性
4. 绘制，将图像绘制出来

在渲染时，如果通过 js 动态修改了 DOM 或 CSS，就会导致页面重新布局（Layout）或渲染（Repaint）

-   Layout，也称为 Reflow，即回流。一般意味着元素的内容、结构、位置或尺寸发生了变化，需要重新计算样式和渲染树
-   Repaint，即重绘。意味着元素发生的改变只是影响了元素的一些外观之类的时候（如背景色、边框颜色、文字颜色等），此时只需要应用新样式绘制这个元素就可以了。

**引起回流的方式**

1. 页面渲染初始化
2. DOM 结构改变，比如删除某个节点
3. render 树变化，比如减少了 padding
4. 窗口 resize
5. 某些属性变化也会引起回流，如 offset、scroll、cilent、width、height，或是调用 getComputedStyle()方法或是 IE 的 currentStyle

**回流一定伴着重绘，而重绘却可以单独出现**

比如 style.color 或 style.backGroundColor 改变，只会重绘，不会回流

### 资源外链的下载

静态的资源外链共分为三种

1. CSS 样式资源
    - 下载时异步，不阻塞渲染 dom tree
    - 阻塞渲染 render tree（防止 css 规则不断改变，避免了重复的构建）
    - media query 声明的 css 不会阻塞渲染
2. JS 脚本资源
    - 阻塞浏览器解析
    - 并发下载其他资源，浏览器优化的一种
    - defer 和 async 异步，不会阻塞渲染
3. img 图片类资源
    - 异步加载，不会阻塞渲染，下载好了用图片替换 src 的地方

## **优化**

1. DNS 解析时使用 DNS 预解析，可以根据浏览器定义的规则，提前解析之后可能会用到的域名，使解析结果缓存到系统缓存中，缩短 DNS 解析时间，来提高网站的访问速度。
2. 构建 TCP 请求会增加大量的网络延时，常用的优化方式如下：
    - 资源打包，合并请求
    - 多使用缓存，减少网络传输；使用一个长久的 Expires 头，可以使某些组件被缓存（要求服务器和客户端时钟严格同步）
    - 使用 keep-alive 建立持久连接
    - 使用多个域名，增加浏览器的资源并发加载数，或者使用 HTTP2 的管道化连接的多路复用技术
3. http 的缓存问题
    - 前后端的 http 交互中，使用缓存能很大程度上的提升效率，而且基本上对性能有要求的前端项目都是必用缓存的
4. http 渲染问题
    - 由于 js 动态修改 DOM 或 CSS 会引起页面 Layout 和 Repaint，而回流的成本高于重绘，一个节点的回流往往会导致子节点以及同级节点的回流，所以在页面渲染时，尽量避免回流。
        - 减少逐项更改样式，最好一次性更改 style，或者将样式定义为 class 并一次性更新
        - 避免循环操作 dom，创建一个 documentFragment 或 div，在它上面应用所有的 DOM 操作，最后再把它添加到 window.document
        - 避免多次读取 offset 等属性，无法避免则将它们缓存到变量
        - 将复杂的元素绝对定位或固定定位，使其脱离文档流，否则回流代价会很高
5. js 和 css 优化
    - 样式表放在头部，脚本放在页面底部
    - 精简图片，使用 css sprites，使用 css sprites 能降低图片数量，带来的将是速度的提升
    - 避免使用 css 表达式
    - 使用外部的 js 和 css；内联脚本或样式可以减少 http 的请求，按理说可以提高页面加载速度。然而在实际中，如果是外部请求的 js 和 css，浏览器就很有可能缓存它们，从而使 html 文档的大小减小，提高页面加载速度
    - 精简 js，如很多不必要的字符，空字符，换行等，整个文件的大小就减少很多
    - 精简 css，合并相同的类，移除不使用的类；使用缩写，如 margin
    - 避免重定向，重定向会延迟整个 html 文档的传输，在 html 文档到达之前，页面不会呈现任何内容
    - 删除重复脚本

### **参考网址**

1. [从输入 url 到页面加载的过程？如何由一道题完善自己的前端知识体系！](https://segmentfault.com/a/1190000013662126?utm_source=index-hottest#articleHeader34)
2. [前端经典面试题: 从输入 URL 到页面加载发生了什么？](https://www.jianshu.com/p/a877684a4cdd)
3. [从输入 URL 到页面加载的全过程](https://www.cnblogs.com/xiaohuochai/p/9193083.html)
