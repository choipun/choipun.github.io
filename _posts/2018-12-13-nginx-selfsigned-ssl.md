---
layout: post
title:  "给 Nginx 创建个自签名 SSL 证书"
date:   2018-12-13 16:36:00 +0800
comments: true
tags: server
---

## 创建证书

应用自签名证书时，浏览器会提示不受信任，比如谷歌浏览器里需要点击 `高级 - 继续访问` 才能打开页面。

### 创建私钥

```bash
openssl genrsa -out server.key 1024
```

### 创建证书签名请求（Certificate Signing Request）

```bash
openssl req -new -key server.key -out server.csr
```

回车之后会有一堆等着你输入的东西，其它东西我们都不需要关心，唯独一个`Common Name`要填成对应网站的IP或者域名，剩余的一路直接回车带过：

```bash
Country Name (2 letter code) [AU]:
State or Province Name (full name) [Some-State]:
Locality Name (eg, city) []:
Organization Name (eg, company) [Internet Widgits Pty Ltd]:
Organizational Unit Name (eg, section) []:
Common Name (e.g. server FQDN or YOUR name) []:192.168.1.2
Email Address []:
A challenge password []:
An optional company name []:
```

因为iOS设备难以绑host，然后也没有必要买个域名，所以上面我直接填了机器的IP： `192.168.1.2`

### 创建自签名证书

```bash
openssl x509 -req -in server.csr -signkey server.key -out server.crt
```

回车后会得到一个 **server.crt**，就是我们成功创建的自签名证书了。

## 配置 Nginx

Nginx 的配置文件一般是在 **/usr/local/etc/nginx** 目录下，打开这个目录下的 **nginx.conf**  进行编辑：

```
http {
  ...
  server {
    listen              443 ssl;
    ssl_certificate     /Users/ios-builder/Documents/server.crt;
    ssl_certificate_key /Users/ios-builder/Documents/server.key;
    ...
  }
}
```

记得修改证书对应地址，这里就给了个片段进行示意。

最后启动或者重启nginx，保证设置生效后测试一下访问效果即可。

