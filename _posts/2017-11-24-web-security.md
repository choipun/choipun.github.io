---
layout: post
title:  "谈谈WEB安全问题"
date:   2017-11-24 13:23:00 +0800
comments: true
tags: web security
---

新项目上线也有一段时间了，主要是一个小型文章发布系统，支持运营人员登录后台自行操作，处理文章的增删改查。

除了基本业务实现外，在数据安全防范方面，我也算是收获了一些心得。

## 关于XSS

XSS 即 Cross-site scripting，跨站脚本攻击，输入代码注入的一种。

关于 XSS 更多信息，看这里 [Cross-site scripting](https://en.wikipedia.org/wiki/Cross-site_scripting)

虽然文章发布功能只在公司内部开放，但也难保意外状况。不过就我目前的处理来看，XSS 是不存在的。

### 基于Vue的模板渲染

使用 **Mustache** 语法 (双大括号) 的文本插值

```html
<span>Message: {{ msg }}</span>
```

双大括号会将数据解释为普通文本，而非 HTML 代码。

### 入库前转义

使用 PHP 的 `htmlspecialchars()` 对提交的内容进行转义。

数据库操作上，使用了第三方框架 [Medoo](https://medoo.in/)，优化SQL语句同时还能防SQL注入，比较省事。

## 关于CSRF

CSRF 即 Cross-site request forgery，跨站伪造请求。

通过AJAX请求数据是无法跨域的，但是对于提交表单而言是可以的。

假如我登录过A网站的后台，知道某个接口的内容，例如删除一篇文章，恰好A网站没有做过任何防范，那么我就可以在B网站写如下内容去执行这个接口：

```html
<form method="POST" action="http://a.com/action=delete">
	<input type="hidden" name="id" value="1">
	<input type="submit" value="submit">
</form>
```

因此对用户提交做验证是非常有必要的。

### CSRF Token
在用户登录后分配一个随机生成且有一定加密算法的 `token` ，并记录在 `session` 里。用户提交数据的时候，连同 `token` 一起提交，与 `session` 里的值进行匹配，`token` 不一致的情况下就拒绝此次提交。

由于B网站无法获取该 `token` ，从而也就避免了跨站请求的发生。

### Referer

还有就是获取HTTP头信息当中的 `Referer`，只接受来源于本站的请求。不过这个字段是可以伪造的，因此并不能完全依赖于此方法。

## 关于SSL

之前知乎就曾被人吐槽过用户登录是将明文密码发送到后端的。那么，当有人与你使用同一个公共网络，通过数据抓包工具获取到了这个内容，这个账号信息也就算是泄露了。

对于需要处理用户登录之类的场景，数据传输过程需要加密，因此网站开启SSL防护是必要的，保障数据的安全及完整性。

一般流程是先是申请证书，然后到域名注册商等待验证通过，下载证书并到服务器进行相关的配置，再强制 `http://` 自动跳转到 `https://`，Windows 服务器的配置方法我之前有写过一篇记录 [Windows Server 安装域名证书](/2017/10/windows-server-ssl)

## 关于 X-Frame-Options

不想自己的网站以 `iframe` 形式被嵌入到别人的网站里，就可以设置这个选项。

如果是 Apache 环境的话，可以在 httpd.conf 当中配置。

首先开启 mod_header 模块

```xml
LoadModule headers_module modules/mod_headers.so
```
然后新增以下内容

```xml
<IfModule mod_headers.c>
Header set X-Frame-Options "SAMEORIGIN"
</IfModule>
```

即可全站开启，`SAMEORIGIN` 是只允许同源访问。

PHP 也可以直接指定头信息

```php
header('X-Frame-Options: SAMEORIGIN');
```

效果是一样的。

## 关于登录验证

登录界面需要增加一个二维码，防止机器批量注册及跨站登录。

然而现在有个新兴职业“打字员”，通过人肉方式暴力破解，已经越来越让验证码的有效性变得岌岌可危。知乎上也不乏有各路大神讨论、分享成功拿下诸如**网易云、极验**等验证码的心得。感兴趣的戳这里 [滑块验证码（滑动验证码）相比图形验证码，破解难度如何？ - 知乎](https://www.zhihu.com/question/32209043)

只靠验证码还不够，可以在用户首次登录之后，要求用户绑定一下谷歌验证器，等于是二重防护。

能破解得了二维码，但是你不知道人家的验证器上面跳动的数字是啥~

## 最后

大致就是这些了，以上也仅仅只是我所接触到的内容，对于整个WEB安全防范而言可能并不全面，如果对本文有什么疑问或者其他建议，还望在下方给我留言。
