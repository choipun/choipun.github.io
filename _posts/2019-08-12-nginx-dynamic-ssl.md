---
layout: post
title:  "配置 Nginx 支持动态证书加载"
date:   2019-08-12 17:18:00 +0800
comments: true
tags: server
---

> 注：本文 Nginx 版本为 `1.16`

最近有个需求是这样的：有任意域名解析到服务器中，希望服务器不做域名绑定，也可访问到我们设置的默认站点，并支持以 https 来访问。由于有的域名是有购买证书的，有的域名没有，又需要绑定到同一个站点上，因此就需要 nginx 能支持证书的动态加载。

设置默认站点，并监听443端口，记得防火墙放行443端口。

```nginx
listen 80 default_server;
listen 443 ssl http2 default_server;
```
动态加载证书文件

```nginx
ssl_certificate    /home/ssl/$ssl_server_name.crt;
ssl_certificate_key    /home/ssl/$ssl_server_name.key;
ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE;
ssl_prefer_server_ciphers on;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
error_page 497  https://$host$request_uri;
```

通过上面的代码片段可知，主要是依赖于 `$ssl_server_name` 这个变量。

当用户以 `https://` 开头访问站点时，他能根据当前的受访域名，去指定目录下查找对应的证书文件，若存在，则加载证书，否则提示连接失败。

而以普通形式 `http://` 访问则不受影响。