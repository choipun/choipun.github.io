---
layout: post
title:  "基于 Vue CLI 的全栈开发记录"
date:   2018-01-01 21:30:00 +0800
comments: true
tags: web vue
---

## 概要

- 调试接口跨域问题
- axios 全局配置
- 直接数据渲染
- vuex管理登录状态
- `window.isDev = {% raw %}isNaN(Number('<?= 1 ?>')){% endraw %}`
- SSE长连接
- Eslint 排除检查

## 调试接口跨域问题

安装 vue-cli 时选的是默认模板 webpack

```bash
$ npm install -g vue-cli
$ vue init webpack project
$ cd project
$ npm install
$ npm run dev
```

首先需要面对的问题是跨域，搜索一番，可以使用基于 node.js 的代理中间件 [http-proxy-middleware](https://github.com/chimurai/http-proxy-middleware#http-proxy-middleware) 来解决问题。
在应用目录下 `/config/index.js` 中，作者已经预留了配置项 `proxyTable: {}`，往这里面填东西就好了。

```javascript
proxyTable: {
  '/api': {
    target: 'http://www.test.com',
    changeOrigin: true,
    pathRewrite: {
      '^/api': '/api'
    }
  }
}
```

在开发环境中，由 node.js 拦截一切 `/api` 的请求，并代理访问 `http://www.test.com/api` 将数据返回给前端。

例如

```javascript
axios.get('/api/user?id=123').then()
```

实际访问的是 `http://www.test.com/api/user?id=123`

## axios 全局配置

由于一直使用的 `vue-resource` 已不再维护更新，所以转投 [axios](https://github.com/axios/axios) 的怀抱。
作为一个高频使用插件，在每次需要用到 `axios` 的时候都 `import` 一次也是挺麻烦的，所以可以直接写进 `Vue` 的原型里

打开入口文件 `src/main.js` 添加

```javascript
import axios from 'axios'
Vue.prototype.$http = axios
```

这样就可以使用在任意模板文件中使用 `this.$http` 来代替 `axios` 了。

## 直接数据渲染

实际应用场景中，还是有许多免不了需要由 PHP 直接将数据渲染到页面上的时候，例如 `csrf-token` 以及 `session`

vue-cli 构建环境依赖于 node.js，而 PHP 又运行于 apache，开发环境直接渲染是不可能了，只能将数据渲染到生成的生产环境模板页面中。

修改配置文件 `/config/index.js` 将生成的文件扩展名改为 `.php`

```javascript
index: path.resolve(__dirname, '../dist/index.php')
```

有需要 PHP 直接渲染的数据，写在项目目录下的模板文件 index.html 中

```javascript
window.isDev = isNaN(Number('<?= 1 ?>'))
```

例如上述代码中，由于 node.js 不能识别 PHP 代码，所以可以用这种方式来判断当前是处于生产环境还是开发环境。

回到一开始的问题，比如 `session` 验证，在模板上添加了 `csrf-token`

```html
<meta name="csrf-token" content="<?= $_SESSION['csrf-token'] ?>">
```

开发环境当中，发送请求的时候带上这个 token

```javascript
this.$http.post('/api/post?action=add', {
  'csrf-token': document.querySelector('meta[name="csrf-token"]').content
})
```

将会直接把 `<?= $_SESSION['csrf-token'] ?>` 作为普通字符串发送到服务端，而不是具体的 token 值。

我想到的方案是：由于前后端/数据库部署在本机上，所以可以判断请求来源，不对来自 `127.0.0.1` 的请求做拦截处理。上线之后这种方案要被伪造，只能是攻击者登录到了服务器上面去吧？不过攻击者都登录服务器了，还伪造这玩意儿干嘛……

对于后端部分不在本机的，只能老老实实 `npm run build` 之后发布到线上测试了。或者调试期间后端同学关闭掉相关验证，测试没问题了发布线上的时候再开启验证。

## Eslint 排除检查

安装 vur-cli 的时候一个手抖，开启了 [Eslint](https://eslint.org/) 语法检查，刚开始的时候没有适应他的规则，感觉自己好像一下子都不会写代码了。

适应一段时间，上手了感觉就没啥问题。不过，自己能按照 Eslint 规则来写，插件未必呀～所以当引入某些插件的时候，控制台 warning 停不下来！！！把插件改成符合 Eslint 规范的格式？别闹了……

第三方插件都是放在 `/src/assets/libs` 目录下，所以必须排除掉对这个文件夹的内容做检查

打开 .eslintignore 把路径添加进去

```
/src/assets/libs/
```

世界瞬间就清净了。

## 实时数据推送

后台系统中有一项审核功能，运营人员希望在活动推广期间能实时获得新消息提醒，告诉运营有多少条待审核数据，而不需要自己去定时刷新页面。

作为一个有逼格的开发者，当然不会使用客户端定时轮询的方式来获取更新，我所想到的有以下方式

- websocket
- SSE + 长连接
- LeanCloud LiveQuery 实现

虽说 `websocket` 很强大，但是开发门槛摆在那里，只是为了这个小功能而花费那么大的精力没什么必要。

`SSE` 即 `server send event`（服务端发送事件）是一开始选择的方案。实现逻辑如下：

1. 客户端发起请求
2. 服务端挂起该请求
3. 服务端定时获取数据库的数据并比对结果，当数据发生变化的时候发送数据到前端
4. 前端接收到更新更改显示的状态

主要解决了前端代码不够优雅的问题，一次请求，就能获得源源不断的数据推送。

不过嘛，其实就是把客户端定时轮询交给了后端去做，依旧没有解决性能浪费的问题。而且当客户端关闭之后，服务端还一直 hold 住这个请求不能及时关闭也是挺傻的。

好在这是用于后台系统，同时只会有一两个运营人员做审核工作。若是用于并发量大一些的场景无疑就是捉襟见肘了。

一开始不用 [LiveQuery](https://leancloud.cn/docs/livequery-guide.html) 主要是不想将这种小功能分离到第三方平台去做，但权衡利弊，LiveQuery 基于 `websocket` 实现，看起来就很靠谱的样子啊。照着[官方文档](https://leancloud.cn/docs/livequery-guide.html)实现，没什么问题，就成了现在所使用的方案。