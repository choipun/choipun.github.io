---
layout: post
title:  "macOS自带PHP环境配置"
date:   2017-10-18 19:00:00 +0800
comments: true
tags: macOS
---

> 以下内容运行环境 macOS Sierra 10.12.6

> 升级到 macOS High Sierra 10.13 之后，需要重新配置 httpd-vhosts.conf 文件，重启 MySQL 服务

## Apache

先把执行权限调整成 root

```bash
$ sudo su -
```

开启服务

```bash
$ sudo apachectl start
```

看到 [http://localhost/](http://localhost/) 显示 **It works!** 说明Apache已经正常运作。

根目录在 /Library/WebServer/Documents 中。

显示 Apache 版本

```bash
$ sudo apachectl -v
```

重启

```bash
$ sudo apachectl restart
```

## PHP

开启PHP之前，先把现有的 httpd.conf 备份一下

```bash
$ cd /etc/apache2/
$ cp httpd.conf httpd.conf.bak
```

打开 httpd.conf 找到以下这行，删除前面的 `#` 解除注释。

```xml
#LoadModule php5_module libexec/apache2/libphp5.so
```

然后重启Apache服务

```bash
$ sudo apachectl restart
```

可以在根目录下写入一个 phpinfo.php

```php
<?php echo phpinfo(); ?>
```

然后打开 [http://localhost/phpinfo.php](http://localhost/phpinfo.php) 看看是否能获取到信息。

查看PHP版本

```bash
$ php -v
```

显示为5.6.3

```bash
PHP 5.6.30 (cli) (built: Feb  7 2017 16:18:37) 
Copyright (c) 1997-2016 The PHP Group
Zend Engine v2.6.0, Copyright (c) 1998-2016 Zend Technologies
```

有点旧，升级之！

```bash
$ curl -s https://php-osx.liip.ch/install.sh | bash -s 7.1
```

此时并不是覆盖原来的版本，而是下载了一个新的版本。 
需要修改默认指向的路径。

```bash
$ sudo vim ~/.bash_profile
```

进入vim模式后按 i 键进入编辑状态，插入这一行：

```bash
export PATH=/usr/local/php5-7.1.8-20170817-170852/bin:$PATH;
```

**以下载的时候显示的路径为准，后面的数字应该是不一样的。**

然后按 esc 键，输入 `:wq` 保存并退出。

接着执行这句：

```bash
$ source ~/.bash_profile
```

再次查看PHP版本就会发现已经更新好了。

最后，把 httpd.conf 中刚刚开启过的 `php5_module` 再注释掉，否则会导致冲突。

再次查看 [http://localhost/phpinfo.php](http://localhost/phpinfo.php) 页面，此时显示的版本为7.1.8 ，一切完美。

## 多站点配置

在站点根目录下建个 test 文件夹，即 /Library/WebServer/Documents/test 

打开 test 并放个 index.php 进去，随便内容写点什么。

接着需要开启vhost服务，打开 httpd.conf，找到以下内容并删除前面的 `#`

```xml
#Include /private/etc/apache2/extra/httpd-vhosts.conf
```

接着，前往 /etc/apache2/extra，编辑 httpd-vhosts.conf 添加如下内容

```xml
<VirtualHost *:80>
    DocumentRoot "/Library/WebServer/Documents/test"
    ServerName www.test.com
</VirtualHost>
```

前往 /etc，编辑 hosts 添加本地域名解析规则。建议是直接复制现有的内容，直接修改就好，不要自己写。

```xml
127.0.0.1	www.test.com
```

配置完毕后，重启一下 Apache 服务

```bash
$ sudo apachectl restart
```

最后，打开地址栏，输入 [http://www.test.com/](http://www.test.com/)，看到了之前新建的 index.php 的内容，说明配置成功！

## MySQL

### 通过 homebrew 来安装

```bash
$ brew install mysql
```

会顺便安装依赖工具 openSSL，当看到 🍺 标志就说明安装成功了。

可以看下有哪些可用命令及相关信息。

```bash
$ mysql --help
```

安装完成后要做点简单配置

```bash
unset TMPDIR
mysql_install_db --verbose --user=`whoami` --basedir="$(brew --prefix mysql)" --datadir=/usr/local/var/mysql --tmpdir=/tmp
```

会看到报错提示未知变量

```bash
mysql_install_db: [ERROR] unknown variable 'tmpdir=/tmp'
2017-09-07 16:35:03 [ERROR]   Unrecognized options
```
不知道是不是就我遇到了这个情况，暂时没有搜索到什么解决方案，跳过貌似没有什么影响。

### 启动MySQL

```bash
mysql.server start
```

### 安全配置

```bash
$ /usr/local/Cellar/mysql/5.7.19/bin/mysql_secure_installation
```

**版本号以实际安装的为准**，可以先查询看下

```bash
$ mysql --version
```

显示如下信息

```bash
$ mysql  Ver 14.14 Distrib 5.7.19, for osx10.12 (x86_64) using  EditLine wrapper
```
也就是 `Distrib ` 后面的 `5.7.19`

之后就是一些设置了。

都是英文看不懂？**macOS很方便的一点就是选中单词以后，双指轻触，就可以查询单词意思。**

homebrew 安装的 mysql 的数据存储位置为 **/usr/local/var/mysql**。 可以通过 `find / -name databasename` 的方式根据数据库名称找到具体位置。

### MySQL 基本操作

登录mysql

```bash
$ mysql -uroot -p
```

会提示需要输入密码，完成后就可以连接上去了。

这个时候，命令行会变成这种形式：

```sql
mysql>
```

查看数据库列表

```sql
mysql> show databases;
```

**注意：所有的 MySQL 操作语句都不能省略后面的** `;` 

显示如下结果

```sql
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
4 rows in set (0.00 sec)
```

创新数据库

```sql
mysql> create database mydb;
```

打开数据库

```sql
mysql> use mydb;
```

查看数据表

```sql
mysql> show tables;
```

### GUI工具

总是敲命令行比较麻烦，也不太直观。可以使用 GUI 工具来进行操作

推荐：

- [Sequel Pro](http://www.sequelpro.com/)
- [phpMyAdmin](https://www.phpmyadmin.net/)