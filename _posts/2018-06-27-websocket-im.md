---
layout: post
title:  "Socket.io 在服务器上的部署记录"
date:   2018-06-27 15:33:00 +0800
comments: true
tags: socket.io
---

- operating system: Centos
- server: Nginx and Nodejs

## 启动 WebSocket 服务

挂起

``` bash
$ nohup node index.js &
```

查看进程 MacOS

```bash
$ jobs -l
```

如果无法找到，就使用 `ps` 命令

```
$ ps -aux|grep index.js
```

关闭进程

```bash
$ kill [pid]
```

## Nginx 配置反向代理

以下配置还升级了协议，从 `ws://` 升级为 `wss://`

需要域名本身开启了SSL

```nginx
location / {        
  # 此处改为 socket.io 后端的 ip 和端口即可
  proxy_pass http://127.0.0.1:5000;

  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "upgrade";
  proxy_http_version 1.1;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header Host $host;
}
```