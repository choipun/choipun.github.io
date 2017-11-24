---
layout: post
title:  "Windows Server 安装域名证书"
date:   2017-10-22 19:00:00 +0800
comments: true
tags: windows
---
## IIS 6

假设已经获取到 `.pfx` 格式证书：

1. 打开IIS
2. 选择网站 --> 点击右键 --> **属性**
3. 点击 **目录安全性** 选项卡
4. **安全通信**一栏，点击**服务器证书**
5. 选择**从.pfx文件导入证书**
6. 导入证书，输入证书密码，一直点击下一步，即可完成。

强制必须以 `https` 打开：

1. 回到**安全通信**一栏，点击**编辑**
2. 勾选 **要求安全通道（SSL）**
3. 勾选 **要求128位加密**

这个时候用户输入 `http` 开头的地址访问网站，服务器将返回一个 `403.4` 的错误

可以自定义一个新的 403.4 错误页面，通过该页面**重定向**到 `https` 开头的地址

新建一个 **redirect.html** 文件

```html
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>loading</title>
</head>
<body>
<script>
	var a = window.location.hostname + window.location.pathname + window.location.search;
	var b = 'https://' + a;
	window.location.href = b;
</script>
</body>
</html>
```

1. 在网站属性中，找到**自定义错误**选项卡
2. 找到错误类型为 `403:4` 的一栏，点击**编辑**
3. 替换文件为刚刚保存的**redirect.html**，点击**确定**

测试一下， 以 `http` 开头访问网站，自动跳转到了 `https` 开头的地址，说明设置成功!

顺便说下生成SSL证书，需要验证域名，要求建立个文件 .well-known/pki-validation/

windows下直接新建文件夹，重命名成 `.well-known` 是无法创建成功的。

解决办法：打开 cmd 进入网站根目录

```cmd
> d:
> cd dirname
> md .well-known
```
