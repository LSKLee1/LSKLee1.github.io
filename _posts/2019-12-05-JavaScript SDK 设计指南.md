---
layout: post
title: "JavaScript SDK 设计指南"
subtitle: "JavaScript SDK 设计指南"
author: "转"
header-img: "img/post-bg-optimization.jpg"
header-mask: 0.4
catalog: true
tags:
  - JavaScript
---

JavaScript SDK 设计指南

> 一份来自工作实战和个人经验的 JavaScript SDK 设计指南

# 简介

本指南旨在介绍如何开发跨平台 PC 和移动端多种浏览器运行的 JavaScript SDK，一句话介绍 SDK，SDK 是用户与浏览器之间的连接桥梁。

# 目录

## 何为 SDK

SDK 对于开发人员来说的确很常见，webopedia 的解释是：

> SDK 是软件开发工具的简称，作为编程工具包，帮助开发者开发特定平台的应用。
>  典型的 SDK 包括：多项 API 接口、编程工具和文档。

## 设计哲学

SDK 设计依赖运行设备和调用方式，但 SDK 设计必须遵循原生、简短、高效、简洁、可读和可测试原则。

使用原生 JS 代码编写 SDK, 不推荐使用 Livescript、Coffeescript、Typescript 等编译语言。

原生方式编写 JS 代码会比其他选择更好。

每项 SDK 新版本发布时，确保新版可以兼容旧版和未来待开发的新版本。因此，请记住编写 SDK 文档和代码注释、单元测试和用户场景测试。

## SDK 场景

来自[第三方 JavaScript 网站](http://thirdpartyjs.com/)的几种场景:

- 嵌入式组件，嵌入网页中的微型交互应用，如：Disqus, Google Maps, Facebook Widget
- 分析统计，收集访问者信息和网站交互情况，如： GA, Flurry, Mixpanel
- web 服务接口包装，用于开发客户端应用，与外部服务通信，如： Facebook Graph API

## SDK 引用方式

建议使用异步语法加载脚本，优化网站用户体验，避免干扰网页加载。

### 异步语法

```js
<script>
  (function () {
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = 'http://<DOMAIN>.com/sdk.js';
    var x = document.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(s, x);
  })();
</script>
```

针对现代浏览器，使用`async`属性

```html
<script async src="http://<DOMAIN>.com/sdk.js"></script>
```

### 传统语法

```html
<script type="text/javascript" src="http://<DOMAIN>.com/sdk.js"></script>
```

### 比较

下图显示异步和传统语法的不同

异步

```ruby
 |----A-----|
    |-----B-----------|
        |-------C------|
```

同步

```ruby
|----A-----||-----B-----------||-------C------|
```

JS 异步和延迟执行相关解释：

> https://developers.google.com/speed/docs/insights/BlockingJS
>  应当避免或少用阻塞 JS,特别是必须加载完成再执行的外部脚本。
>  与渲染页面内容相关的脚本需内联在页面中避免额外网络请求，但是内联内容需要很小体积，同时快速高效执行。
>  与首屏渲染无关的脚本应当在首屏渲染后进行异步或延迟处理。

### 异步加载问题

当使用异步加载时，不能在页面内立即执行 SDK 函数。

```html
<script>
  (function() {
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.async = true;
    s.src = "http://<DOMAIN>.com/sdk.js";
    var x = document.getElementsByTagName("script")[0];
    x.parentNode.insertBefore(s, x);
  })();

  // execute your script immediately here
  SDKName("some arguments");
</script>
```

执行结果会报`undefined`, 因为函数在脚本未加载完就执行，需要加入点技巧确保脚本成功运行。

事件存储在`SDKName.q`队列数组变量中，这样 SDK 可以处理和执行`SDKName.q`，重新初始化`SDKName`命名空间。

```html
<script>
  (function() {
    // add a queue event here
    SDKName =
      SDKName ||
      function() {
        (SDKName.q = SDKName.q || []).push(arguments);
      };
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.async = true;
    s.src = "http://<DOMAIN>.com/sdk.js";
    var x = document.getElementsByTagName("script")[0];
    x.parentNode.insertBefore(s, x);
  })();

  // execute your script immediately here
  SDKName("some arguments");
</script>
```

也可以用`[].push`方式：

```html
<script>
  (function() {
    // add a queue event here
    SDKName = window.SDKName || (window.SDKName = []);
    var s = document.createElement("script");
    s.type = "text/javascript";
    s.async = true;
    s.src = "http://<DOMAIN>.com/sdk.js";
    var x = document.getElementsByTagName("script")[0];
    x.parentNode.insertBefore(s, x);
  })();

  // execute your script immediately here
  SDKName.push(["some arguments"]);
</script>
```

### 其他引用方式

使用 ES2015 规范的`import`

```js
import "your-sdk";
```

模块化引用 Javascript

```js
module("sdk.js", ["sdk-track.js", "sdk-beacon.js"], function(track, beacon) {
  // sdk definitions, split into local and global/exported definitions
  // local definitions
  // exports
});

// you should contain this "module" method
(function() {
  var modules = {}; // private record of module data

  // modules are functions with additional information
  function module(name, imports, mod) {
    // record module information
    window.console.log("found module " + name);
    modules[name] = { name: name, imports: imports, mod: mod };

    // trigger loading of import dependencies
    for (var imp in imports) loadModule(imports[imp]);

    // check whether this was the last module to be loaded
    // in a given dependency group
    loadedModule(name);
  }

  // function loadModule
  // function loadedModule

  window.module = module;
})();
```

## SDK 版本管理

请避免使用诸如`brand-v<timestamp>.js`、 `brand-v<datetime>.js`，`brand-v1-v2.js`之类的特殊版本号，会引起 SDK 使用者无法识别最新版本。

可以使用[语义化版本号](http://semver.org/)管理 SDK 版本，形式是`主版本.次版本.补丁版本`。

`v1.0.0` `v1.5.0` `v2.0.0`这样的版本号很容易在变更日志文章中查找。

我们可以使用多种方式表示 SDK 版本，取决于具体部署服务和设计。

使用 query string 路径

```cpp
http://<DOMAIN>.com/sdk.js?v=1.0.0
```

使用文件夹命名

```cpp
http://<DOMAIN>.com/v1.0.0/sdk.js
```

使用子域名

```cpp
http://v1.<DOMAIN>.com/sdk.js
```

建议使用`stable`, `unstable`, `alpha`, `latest`, `experimental`版本号管理后续开发版本。

```cpp
http://<DOMAIN>.com/sdk-stable.js
http://<DOMAIN>.com/sdk-unstable.js
http://<DOMAIN>.com/sdk-alpha.js
http://<DOMAIN>.com/sdk-latest.js
http://<DOMAIN>.com/sdk-experimental.js
```

## 变更日志文档

如果没有更新文档，SDK 使用者不知道 SDK 升级情况。

记住编写变更日志文档记录主要、次要甚至是 bug 修复变更。

如果可以追溯 SDK 接口变化，这会是很好的开发体验。

每个版本可以这样写：

```csharp
[Added] for new features.
[Changed] for changes in existing functionality.
[Deprecated] for once-stable features removed in upcoming releases.
[Removed] for deprecated features removed in this release.
[Fixed] for any bug fixes.
[Security] to invite users to upgrade in case of vulnerabilities.
```

此外， [commit-message-emoji](https://github.com/dannyfritz/commit-message-emoji) 可以使用图标解释每次提交的变化

## 命名空间

SDK 中不要定义多个命名空间，防止名称与其他库冲突。

SDK 代码中使用`(function () { ... })()`或 ES6 块`{ ... }`包装 SDK 代码。

如何避免命名空间冲突

谷歌统计脚本通过改变`ga`值自定义命名空间

```js
(function(i, s, o, g, r, a, m) {
  i["GoogleAnalyticsObject"] = r;
  (i[r] =
    i[r] ||
    function() {
      (i[r].q = i[r].q || []).push(arguments);
    }),
    (i[r].l = 1 * new Date());
  (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
  a.async = 1;
  a.src = g;
  m.parentNode.insertBefore(a, m);
})(window, document, "script", "//www.google-analytics.com/analytics.js", "ga");
```

[OpenX experience](http://docs.openx.com/ad_server/adtags_namespace.html)支持通过传参请求命名空间

```html
<script src="http://your_domain/sdk?namespace=yourcompany"></script>
```

## 存储机制

### Cookie

不同域名下使用 cookie 情形有点复杂，具体包括子域名和路径

域名`http://github.com` `/`路径下设置 cookie`first=value1`
 在子域名`http://sub.github.com` 设置 cookie `second=value2`

不同域下读取情况如下：

|               | http://github.com | http://sub.github.com |
| :-----------: | :---------------: | :-------------------: |
| first=value1  |         ✓         |           ✓           |
| second=value2 |         ✘         |           ✓           |

域名`http://github.com` 设置 cookie`first=value1`
 在子域名`http://sub.github.com` 设置 cookie `second=value2`
 在子域名`http://sub.github.com` 设置 cookie `third=value3`

|               | http://github.com | http://github.com/path1 | http://sub.github.com |
| :-----------: | :---------------: | :---------------------: | :-------------------: |
| first=value1  |         ✓         |            ✓            |           ✓           |
| second=value2 |         ✘         |            ✓            |           ✘           |
| third=value3  |         ✘         |            ✘            |           ✓           |

#### 检测 Cookie 是否可写

检测给定域名，默认当前域，cookie 是否可写

```js
var checkCookieWritable = function(domain) {
  try {
    // Create cookie
    document.cookie = "cookietest=1" + (domain ? "; domain=" + domain : "");
    var ret = document.cookie.indexOf("cookietest=") != -1;
    // Delete cookie
    document.cookie =
      "cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT" +
      (domain ? "; domain=" + domain : "");
    return ret;
  } catch (e) {
    return false;
  }
};
```

#### 检测第三方 Cookie 是否可写

只用客户端 JS 可以实现检测， [示例](https://dl.dropboxusercontent.com/u/105727/web/3rd/third-party-cookies.html)

#### Cookie 读写

cookie 读写删除

```js
var cookie = {
  write: function(name, value, days, domain, path) {
    var date = new Date();
    days = days || 730; // two years
    path = path || "/";
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    var expires = "; expires=" + date.toGMTString();
    var cookieValue = name + "=" + value + expires + "; path=" + path;
    if (domain) {
      cookieValue += "; domain=" + domain;
    }
    document.cookie = cookieValue;
  },
  read: function(name) {
    var allCookie = "" + document.cookie;
    var index = allCookie.indexOf(name);
    if (name === undefined || name === "" || index === -1) return "";
    var ind1 = allCookie.indexOf(";", index);
    if (ind1 == -1) ind1 = allCookie.length;
    return unescape(allCookie.substring(index + name.length + 1, ind1));
  },
  remove: function(name) {
    if (this.read(name)) {
      this.write(name, "", -1, "/");
    }
  }
};
```

### Session

客户端无法写 session，可以咨询服务端团队处理 session

### LocalStorage

LS 数据存储没有过期时间，存储限制更大，最小 5M, 而且信息不会发送给服务器。

注意相同域名的不同协议`http`和`https`之间无法共享数据。

可以通过创建 iframe, 使用`postMessage`传递数据。 [示例](http://stackoverflow.com/questions/10502469/is-there-any-workaround-to-make-use-of-html5-localstorage-on-both-http-and-https)

#### 检测 LS 是否可写

window.localStorage 存在兼容性问题，需要检测 API 是否可用

```js
var testCanLocalStorage = function() {
  var mod = "modernizr";
  try {
    localStorage.setItem(mod, mod);
    localStorage.removeItem(mod);
    return true;
  } catch (e) {
    return false;
  }
};
```

### SessionStorage

用于存储单次会话数据，标签页关闭后会丢失

```js
var checkCanSessionStorage = function() {
  var mod = "modernizr";
  try {
    sessionStorage.setItem(mod, mod);
    sessionStorage.removeItem(mod);
    return true;
  } catch (e) {
    return false;
  }
};
```

## 事件处理

浏览器有很多事件，如: `load` `unload` `on` `off` `bind`，

下面是处理不同平台的[垫片](https://remysharp.com/2010/10/08/what-is-a-polyfill)

### DOM Ready

用于确保 SDK 函数执行前整个网页完成 DOM 加载

```js
// handle IE8+
function ready(fn) {
  if (document.readyState != "loading") {
    fn();
  } else if (window.addEventListener) {
    // window.addEventListener('load', fn);
    window.addEventListener("DOMContentLoaded", fn);
  } else {
    window.attachEvent("onreadystatechange", function() {
      if (document.readyState != "loading") fn();
    });
  }
}
```

> **DOMContentLoaded** 在文档完全加载和解析，DOM 树生成时触发，无需等待样式、图片和子 iframe 完成加载， [参考](https://github.com/loverajoel/jstips/blob/master/_posts/en/javascript/2016-02-15-detect-document-ready-in-pure-js.md)

> **load**事件用于检测整个页面完全加载

> [element-ready](https://github.com/sindresorhus/element-ready)

### 消息事件

用户在 iframe 和窗口之间进行跨域通信，[Mozilla API](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)。

```js
// in the iframe
parent.postMessage("Hello"); // string

// ==========================================

// in the iframe's parent
// Create IE + others compatible event handler
var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
var eventer = window[eventMethod];
var messageEvent = eventMethod == "attachEvent" ? "onmessage" : "message";

// Listen to message from child window
eventer(
  messageEvent,
  function(e) {
    // e.origin , check the message origin
    console.log("parent received message!:  ", e.data);
  },
  false
);
```

传递消息数据可以是字符串，更高级用法可以用 json, 使用`JSON String`

尽管现代浏览器支持[结构化复制算法](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)解析参数，但不是全部浏览器都支持。

### 设备方向变化

检测设备方向变化

```js
window.addEventListener("orientationchange", fn);
```

获取方向旋转度数

```js
window.orientation; // => 90, -90, 0
```

检测方向

```js
// https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation
var orientation =
  screen.orientation || screen.mozOrientation || screen.msOrientation;
```

### 禁止滚动

web 端可以使用 css `overflow: hidden`禁止滚动，但某些移动端不支持，可以用 JS 事件

```js
document.addEventListener("touchstart", function(e) {
  e.preventDefault();
}); // prevent scroll
// or
document.body.addEventListener("touchstart", function(e) {
  e.preventDefault();
}); // prevent scroll
// use move if you need some touch event
document.addEventListener("touchmove", function(e) {
  e.preventDefault();
}); // prevent scroll
```

## 数据请求

客户端和服务器数据交互可以使用 ajax 请求，但其实有更好方法。

### 图像信标

使用图像信标执行 get 请求获取图片

**需要加上时间戳防止浏览器缓存**

```js
new Image().src = "http://<DOMAIN>.com/collect?id=1111";
```

查询字符串有长度限制，比如 1024，取决于浏览器和服务器，可以做如下处理规避



```js
if (length > 2048) {
  // do Multiple Post (form)
} else {
  // do Image Beacon
}
```

监听图片加载事件

```js
var img = new Image();
img.src = "http://<DOMAIN>.com/collect?id=1111";
img.onload = successCallback;
img.onerror = errorCallback;
```

### 单 POST 请求

使用原生表单 POST 方法发送键值数据

```js
var form = document.createElement("form");
var input = document.createElement("input");

form.style.display = "none";
form.setAttribute("method", "POST");
form.setAttribute("action", "http://<DOMAIN>.com/track");

input.name = "username";
input.value = "attacker";

form.appendChild(input);
document.getElementsByTagName("body")[0].appendChild(form);

form.submit();
```

### 多 POST 请求

```js
function requestWithoutAjax(url, params, method) {
  params = params || {};
  method = method || "post";

  // function to remove the iframe
  var removeIframe = function(iframe) {
    iframe.parentElement.removeChild(iframe);
  };

  // make a iframe...
  var iframe = document.createElement("iframe");
  iframe.style.display = "none";

  iframe.onload = function() {
    var iframeDoc = this.contentWindow.document;

    // Make a invisible form
    var form = iframeDoc.createElement("form");
    form.method = method;
    form.action = url;
    iframeDoc.body.appendChild(form);

    // pass the parameters
    for (var name in params) {
      var input = iframeDoc.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = params[name];
      form.appendChild(input);
    }

    form.submit();
    // remove the iframe
    setTimeout(function() {
      removeIframe(iframe);
    }, 500);
  };

  document.body.appendChild(iframe);
}

requestWithoutAjax("url/to", { id: 2, price: 2.5, lastname: "Gamez" });
```

### Iframe

使用 iframe 嵌入网页

```js
var iframe = document.createElement("iframe");
var body = document.getElementsByTagName("body")[0];

iframe.style.display = "none";
iframe.src = "http://<DOMAIN>.com/page";
iframe.onreadystatechange = function() {
  if (iframe.readyState !== "complete") {
    return;
  }
};
iframe.onload = loadCallback;

body.appendChild(iframe);
```

**移除 iframe 内部边距**



```html
<iframe
  src="..."
  marginwidth="0"
  marginheight="0"
  hspace="0"
  vspace="0"
  frameborder="0"
  scrolling="no"
></iframe>
```

**iframe 内加载 html**

```html
<iframe id="iframe"></iframe>

<script>
  var html_string= "content <script>alert(location.href);</script
>"; document.getElementById('iframe').src = "data:text/html;charset=utf-8," +
escape(html_string); // alert data:text/html;charset=utf-8..... // access cookie
get ERROR var doc = document.getElementById('iframe').contentWindow.document;
doc.open(); doc.write('
<body>
  Test<script>
    alert(location.href);
  </script>
</body>
'); doc.close(); // alert "top window url" var iframe =
document.createElement('iframe'); iframe.src = 'javascript:;\'' + encodeURI('
<html>
  <body>
    <script>
      alert(location.href);</body></html>') + '\'';
        // iframe.src = 'javascript:;"' + encodeURI((html_tag).replace(/\"/g, '\\\"')) + '"';
        document.body.appendChild(iframe);
        // alert "about:blank"
    </script>
  </body>
</html>
```

### jsonp 脚本

```js
(function() {
  var s = document.createElement("script");
  s.type = "text/javascript";
  s.async = true;
  s.src = "/yourscript?some=parameter&callback=jsonpCallback";
  var x = document.getElementsByTagName("script")[0];
  x.parentNode.insertBefore(s, x);
})();
```

JSONP 特点

1. JSONP 只能用于 GET 请求
2. JSONP 缺乏错误处理，无法检测 404、500 等状态码
3. JSONP 只支持异步
4. 注意防止 CSRF 攻击
5. 支持跨域通信，服务端无需设置 CORS

### Navigator.sendBeacon()

[Mozilla 文档]([documentation](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon)

用于 DOM 文档卸载前发送统计和诊断数据，但数据很难确保卸载期间数据发送成功

```js
navigator.sendBeacon("/log", analyticsData);
```

### XHR

XHR 的几个垫片

1.  [window.fetch](https://github.com/github/fetch) - window.fetch 方法垫片
2.  [got](https://github.com/sindresorhus/got) - 简版 HTTP/HTTPS requests
3.  [microjs](http://microjs.com/#ajax) - ajax 库列表

### 参数片识别

注意哈希标识`#`后面的数据不会传递给 http 请求。

```js
// Sending a request with a parameter url which contains current url
new Image().src =
  "http://yourrequest.com?url=http://github.com/awesome#hueitan";

// actual request will be without #
new Image().src = "http://yourrequest.com?url=http://github.com/awesome";

// Solved, encodeURIComponent(url);
new Image().src =
  "http://yourrequest.com?url=" +
  encodeURIComponent("http://github.com/awesome#hueitan");
```

### 最大连接数

检查浏览器的最大连接数

![img](https:////upload-images.jianshu.io/upload_images/8757538-9776e9514ddbba0c.png?imageMogr2/auto-orient/strip|imageView2/2/w/479/format/webp)

最大连接数

## URI 组成

```ruby
                         authority
                   __________|_________
                  /                    \
              userinfo                host                          resource
               __|___                ___|___                 __________|___________
              /      \              /       \               /                      \
         username  password     hostname    port     path & segment      query   fragment
           __|___   __|__    ______|______   |   __________|_________   ____|____   |
          /      \ /     \  /             \ / \ /                    \ /         \ / \
    foo://username:password@www.example.com:123/hello/world/there.html?name=ferret#foo
    \_/                     \ / \       \ /    \__________/ \     \__/
     |                       |   \       |           |       \      |
  scheme               subdomain  \     tld      directory    \   suffix
                                   \____/                      \___/
                                      |                          |
                                    domain                   filename
```

### 解析 URI

使用原生 URL 解析

```js
var parser = new URL("http://github.com/hueitan");
parser.hostname; // => "github.com"
```

使用`createElement`解析

```js
var parser = document.createElement("a");
parser.href = "http://github.com/hueitan";
parser.hostname; // => "github.com"
```

## 调试

### 模拟多个域名

更改操作系统 host 文件配置模拟不同域名

```shell
$ sudo vim /etc/hosts
```

Add the following entries

```shell
# refer to localhost
127.0.0.1 publisher.net
127.0.0.1 sdk.net
```

### 开发者工具

可以使用浏览器自带调试工具调试 JS SDK 代码，如： `Chrome Developer Tools` `Safari Developer Tools` `Firebug`

> 开发者工具为 web 开发者提供浏览器和 web 应用内部访问，使用开发者工具可以高效追踪布局问题，设置 JS 断点，找到代码优化的思路。

### Console.log

控制台日志可以通过浏览器 API`console.log`输入，主要用于测试预期输出日志和其他通用调试。

![img](https:////upload-images.jianshu.io/upload_images/8757538-ca5664380092c270.png?imageMogr2/auto-orient/strip|imageView2/2/w/1200/format/webp)

调试日志截图

### 调试代理工具

有时调试代理工具可以帮助测试 SDK。

调试网络状态、修改 cookie、http 头、缓存设置， 编辑 http 请求和响应，SSL 代理，ajax 请求调试等等。

代理工具列表:

- [FiddlerCore](http://www.telerik.com/fiddler/fiddlercore)
- [Charles](http://www.charlesproxy.com)
- [Cellist](https://itunes.apple.com/tw/app/cellist-http-debugging-proxy/id897814548?l=zh&mt=12)

### BrowserSync

[BrowserSync](http://www.browsersync.io) 通过跨多个设备间同步文件变化和交互，实现更快代码调整和测试。

如需测试 SDK 在多设备间的运行结果，BrowserSync 很有用。

### 调试 Node.js 应用

在谷歌开发者工具中调试 nodejs 代码，要求 Node.js 版本 v6.3.0+

```shell
$ node --inspect-brk [script.js]
```

- [BrowserSync 中文](http://www.browsersync.cn/)
- [Official document](https://nodejs.org/en/docs/inspector/)
- [Paul Irish gave a talk in 15 minutes about how to use --inspect](https://www.youtube.com/watch?v=Xb_0awoShR8)

## 提示与技巧

### 补充

有时我们不想开发者引用所有 SDK 源，我们只需要发 1 像素请求，例如，加载感谢或结束页面时返回请求。

可以让开发者使用提供的链接地址引入图片文件。

```html
<img
  height="1"
  width="1"
  alt=""
  style="display:none"
  src="https://yourUrlLink.com/t?timestamp=1234567890&type=page1&currency=USD&noscript=1"
/>
```

### 页面可见性 API

标签页之间切检测用户是否在当前页。

[visibly.js](https://github.com/addyosmani/visibly.js)

[visibilityjs](https://github.com/ai/visibilityjs)

### HTTP 文档 Referrer

`document.referrer`指的是浏览器 referrer，不是用户操作 referrer。

点击返回按钮，例如： 页面 A -> 页面 B -> 页面 C -> 返回按钮 页面 B, 当前页面 B 的 referrer 指向页面 A，而不是页面 C。

### Console.log 垫片

确保调用`console`API 不会报错

```js
if (typeof console === "undefined") {
  var f = function() {};
  console = {
    log: f,
    debug: f,
    error: f,
    info: f
  };
}
```

### EncodeURI/EncodeURIComponent

理解`escape()` `encodeURI()` `encodeURIComponent()` 编码方法之间的差异，[文档](http://stackoverflow.com/a/3608791/1748884)

`encodeURI()` 和`encodeURIComponent()` 方法有 11 个字符编码结果不同，

具体是: # $ & + , / : ; = ? @，[相关讨论](http://stackoverflow.com/a/23842171/1748884)。

![img](https:////upload-images.jianshu.io/upload_images/8757538-e42af1071e6841e7.png?imageMogr2/auto-orient/strip|imageView2/2/w/483/format/webp)

encodeuri和encodeuricomponent比较

### 可能不需要 jQuery

如题，[网站](http://youmightnotneedjquery.com/)提供很多有用工具代码

http://blog.garstasio.com/you-dont-need-jquery/

### 脚本加载回调

和异步脚本加载类似，增加回调事件处理

```js
function loadScript(url, callback) {
  var script = document.createElement("script");
  script.async = true;
  script.src = url;

  var entry = document.getElementsByTagName("script")[0];
  entry.parentNode.insertBefore(script, entry);

  script.onload = script.onreadystatechange = function() {
    var rdyState = script.readyState;

    if (!rdyState || /complete|loaded/.test(script.readyState)) {
      callback();

      // detach the event handler to avoid memory leaks in IE (http://mng.bz/W8fx)
      script.onload = null;
      script.onreadystatechange = null;
    }
  };
}
```

### 单次执行函数

> 有时你只想函数仅运行一次，很多时候带有复杂处理的事件监听回调有这种函数。
>  但让如果处理比较简单，可以直接删除监听函数，但有时需要函数仅调用一次。

```js
// Copy from DWB
// http://davidwalsh.name/javascript-once
function once(fn, context) {
  var result;

  return function() {
    if (fn) {
      result = fn.apply(context || this, arguments);
      fn = null;
    }

    return result;
  };
}

// Usage
var canOnlyFireOnce = once(function() {
  console.log("Fired!");
});

canOnlyFireOnce(); // "Fired!"
canOnlyFireOnce(); // nada
```

**补充**

- [throttle/debounce](https://blog.coding.net/blog/the-difference-between-throttle-and-debounce-in-underscorejs)
- [rxjs-debounce](https://blog.techbridge.cc/2017/12/08/rxjs/)

### 设备像素比 DPR

[Device pixel ratio - Mobile Web Development](https://www.youtube.com/watch?v=u0rfDeaxehc) 

[Mobile device pixels - Mobile Web Development](https://www.youtube.com/watch?t=34&v=UUF4jD-xoYc)

### 获取样式值

**获取行内样式值**

```html
<span id="black" style="color: black"> This is black color span </span>
<script>
  document.getElementById("black").style.color; // => black
</script>
```

**获取真实样式值**

```html
<style>
  #black {
    color: red !important;
  }
</style>

<span id="black" style="color: black"> This is black color span </span>

<script>
  document.getElementById("black").style.color; // => black

  // real
  var black = document.getElementById("black");
  window.getComputedStyle(black, null).getPropertyValue("color"); // => rgb(255, 0, 0)
</script>
```

### 检测元素是否在视口内

```js
// http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport/7557433#7557433
function isElementInViewport(el) {
  //special bonus for those using jQuery
  if (typeof jQuery === "function" && el instanceof jQuery) {
    el = el[0];
  }

  var rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight ||
        document.documentElement.clientHeight) /*or $(window).height() */ &&
    rect.right <=
      (window.innerWidth ||
        document.documentElement.clientWidth) /*or $(window).width() */
  );
}
```

### 检测元素是否可见

```js
var isVisible = function(b) {
  var a = window.getComputedStyle(b);
  return 0 === a.getPropertyValue("opacity") ||
    "none" === a.getPropertyValue("display") ||
    "hidden" === a.getPropertyValue("visibility") ||
    0 === parseInt(b.style.opacity, 10) ||
    "none" === b.style.display ||
    "hidden" === b.style.visibility
    ? false
    : true;
};

var element = document.getElementById("box");
isVisible(element); // => false or true
```

### 获取视口尺寸

```js
var getViewportSize = function() {
  try {
    var doc = top.document.documentElement,
      g =
        (e = top.document.body) &&
        top.document.clientWidth &&
        top.document.clientHeight;
  } catch (e) {
    var doc = document.documentElement,
      g = (e = document.body) && document.clientWidth && document.clientHeight;
  }
  var vp = [];
  doc &&
  doc.clientWidth &&
  doc.clientHeight &&
  ("CSS1Compat" === document.compatMode || !g)
    ? (vp = [doc.clientWidth, doc.clientHeight])
    : g && (vp = [doc.clientWidth, doc.clientHeight]);
  return vp;
};

// return as array [viewport_width, viewport_height]
```

### 用户跟踪

假设某邪恶广告公司想跟踪用户行为，它会用[fingerprinting](https://github.com/Valve/fingerprintjs2)生成个人定制哈希，

而有道德的公司会通过提示，让用户选择是否使用 cookie。

### 广告服务提示

[数字广告联盟](http://optout.aboutads.info/#!/) 提供工具帮助人们选择是否使用联盟参与公司的广告服务。

## 注意 WTF

### HTTP 头的 referer 字段拼写错误

HTTP 请求头的 referrer 字段拼写错误，根据[维基百科](https://en.wikipedia.org/wiki/HTTP_referer#Etymology)说明:

> referer 字段拼写错误起源于计算机科学家 `菲利普 哈纳姆-贝克`的提案，提议將该字段加入 HTTP 标准，
>  `RFC 1945`标准文档 `请求注释`最终收入这个错误拼写, 该文档的合作者 `罗伊 菲尔丁`表示当时标准的`unix拼写检查器`均不能识别 "referrer" 或 "referer"。
>  Referer 从此成为行业内讨论 HTTP 引用时广泛拼写的单词，其实 referrer 单词并不总是被拼错，某些 web 标准中，如 `DOM（文档对象模型）`中就使用正确的拼写方式。

![img](https:////upload-images.jianshu.io/upload_images/8757538-da0cc18f0e807708.png?imageMogr2/auto-orient/strip|imageView2/2/w/601/format/webp)

HTTP请求头的referer字段

## JavaScript SDK 模板

**初始化模板**

```javascript
(function(window) {
  // declare
  var myApp = {};

  // your sdk init function
  myApp.init = function() {
    // ...
  };

  // define your namespace myApp
  window.myApp = myApp;
})(window, undefined);
```

**包装模板**

```javascript
(function(window) {
  // add your sdk function and method here and there
})(window, undefined);
```

**面向对象模板**

```javascript
(function(window) {
  // declare
  var myApp = function() {
    return;
  };

  // your sdk init function
  myApp.prototype.init = function() {
    // ...
  };

  // define your namespace myApp
  window.myApp = new myApp();
})(window, undefined);
```

# 参考链接

- http://www.webopedia.com/TERM/S/SDK.html
- https://github.com/github/fetch
- https://remysharp.com/2010/10/08/what-is-a-polyfill
- http://peter.sh/experiments/asynchronous-and-deferred-javascript-execution-explained/
- http://stackoverflow.com/questions/2414750/difference-between-domcontentloaded-and-load-events
- https://medium.com/javascript-scene/must-see-javascript-dev-tools-that-put-other-dev-tools-to-shame-aca6d3e3d925
- https://github.com/noffle/art-of-readme
- https://github.com/dannyfritz/commit-message-emoji
- [generate random UUIDs](https://gist.github.com/jed/982883)
- [语义化版本管理 2.0](http://semver.org/)
- http://blog.npmjs.org/post/162134793605/why-use-semver
- [理解 URI](http://medialize.github.io/URI.js/about-uris.html)

# 转载链接

## 翻译链接

- https://www.jianshu.com/p/735a4f1db2af

## 原文链接

- http://hueitan.github.io/javascript-sdk-design/