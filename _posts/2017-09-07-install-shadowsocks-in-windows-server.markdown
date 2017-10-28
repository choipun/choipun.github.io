---
layout: post
title:  "Windwos服务端搭建Shadowsocks"
date:   2017-09-07 19:00:00 +0800
comments: true
---

# 服务端

#### 安装 Python

首先去到 Python 官网下载 Python V2 ：[点击前往](https://www.python.org/downloads/)

[32位系统点我](https://www.python.org/ftp/python/2.7.14/python-2.7.14rc1.msi)

[64位系统点我](https://www.python.org/ftp/python/2.7.14/python-2.7.14rc1.amd64.msi)

**注意：最好是根据现在系统的环境来选择，并且要与OpenSSL对应，不能用32位 Python 与64位的 OpenSSL 搭配使用。**

#### 安装 OpenSSL

同样去到 OpenSSL 官网下载：[OpenSSL](https://slproweb.com/products/Win32OpenSSL.html)

[32位系统点我](https://slproweb.com/download/Win32OpenSSL-1_0_2L.exe)

[64位系统点我](https://slproweb.com/download/Win64OpenSSL-1_0_2L.exe)

这里需要注意

OpenSSL 需要 **Visual C++ 2008 Redistributables** 支持

[32位系统点我](http://www.microsoft.com/downloads/details.aspx?familyid=9B2DA534-3E03-4391-8A4D-074B9F2BC1BF)

[64位系统点我](http://www.microsoft.com/downloads/details.aspx?familyid=bd2a6171-e2d6-4230-b809-9a8d7548c1b6)

#### 安装 Shadowsocks

安装完成后，如按照默认路径，使用方法如下

打开 cmd

> （Windows Server 2012 R2 系统可按 Windows 图标+X+A打开管理员权限的命令提示符）

进入 Python 目录

```
cd C:\Python27\Scripts
```

也可以用资源管理器进入到该目录，然后按住 Shift + 鼠标右键，选择 **在此处打开命令窗口**

然后输入

```
pip install shadowsocks
```

看到多出来几个文件，显示finished之类的字样就是下载成功了。

#### 配置 Shadowsocks

同样需要在 C:\Python27\Scripts 运行命令提示符(管理员)

```
ssserver.exe -p 8893 -k password -m aes-256-cfb
```

`8893` 为服务器端口，`password` 为密码，到时在客户端填上服务器的 IP 及此处设置的端口和密码就能使用了

当然，也可以使用配置文件的方法，在 C:\Python27\Scripts 新建一个名为 shadowsocks.json 的文件，以记事本打开

```json
{
    "server":"localhost",
    "server_port":8893,
    "local_address": "127.0.0.1",
    "local_port":1080,
    "password":"password",
    "timeout":300,
    "method":"aes-256-cfb",
    "fast_open": false
}
```

然后运行

```
ssserver.exe -c C:\Python27\Scripts\shadowsocks.json
```

# 客户端

Shadowsocks 客户端官网下载页面：[点我前往](https://shadowsocks.org/en/download/clients.html)

解压到任意目录，双击启动 **Shadowsocks.exe**，可以在右下角的系统任务栏看到一个 **纸飞机** 的图标，右键纸飞机图标，勾选设置

- 启用系统代理
- 允许来自局域网的连接

点开 **服务器** --> **编辑服务器**：

对应 shadowsocks.json 配置文件，对照相同项目来填写。填写完以后按 **确定** 保存配置。

接着右键纸飞机图标 --> **服务器**，勾选刚刚设置的那个。