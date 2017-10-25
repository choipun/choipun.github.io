---
layout: post
title:  "安装 Jekyll 踩坑记录"
date:   2017-10-24 21:19:37 +0800
---


What is Jekyll?

> Transform your plain text into static websites and blogs. [jekyllrb.com](http://jekyllrb.com/)

## 安装

需要有**完整的 Ruby 开发环境**，[前置需求看这里](https://jekyllrb.com/docs/installation/#requirements)


```bash
$ gem install jekyll
```

macOS 会遇到这个坑

```bash
Fetching: public_suffix-3.0.0.gem (100%)
ERROR:  While executing gem ... (Gem::FilePermissionError)
    You dont have write permissions for the /Library/Ruby/Gems/2.3.0 directory.
```

没有写入权限。可以用 `sudo` 解决，往系统自带的 Ruby 库中塞东西

也可以用 Homebrew 另外装个 Ruby

```bash
$ brew install ruby
```

然后可以了？ N A I V E

还要修改一下 `$PATH`

```bash
vim ~/.bash_profile
```

写入这句

```bash
export PATH=/usr/local/bin:$PATH
```

然后应用

```bash
source ~/.bash_profile
```

再次尝试安装，可以开始下载了！ 不过还是报了错误，大意是说，缺少安装必要的工具，查看 .log 

```log
package configuration for libffi is not found
```

看了下官网的 [问题排查](https://jekyllrb.com/docs/troubleshooting/)，升级了 RubyGems

```bash
$ gem update --system
```
没有作用，再尝试安装新命令行工具

```bash
$ xcode-select --install
```

然后再次尝试安装 Jekyll **就成功了**！

好了，初始化一下 blog 

```bash
$ jekyll new blog
$ cd blog
$ bundle exec jekyll serve
```
嗯，果然没有那么顺利

```bash
-bash: bundle: command not found
```

所以要再安装个 `bundler`

```bash
$ gem install bundler
```

安装完了再次启动服务试试

然后可以了？Nope

```bash
Could not find gem 'minima (~> 2.0)' in any of the gem sources listed in your Gemfile.
Run `bundle install` to install missing gems.
```

果不其然可以在 github 找到提过的 issues，更新一下 bundler

```bash
$ bundle update
```

就会发现安装上了 `minima`

```bash
Fetching minima 2.1.1
Installing minima 2.1.1
```

应该不会有问题了吧？小心翼翼再次启动服务试试

```bash
$ bundle exec jekyll serve
```

终于看见了以下信息

```bash
Server address: http://127.0.0.1:4000/
Server running... press ctrl-c to stop.
```
浏览器里打开看看，一切都是那么完美！

# Minima

minima 是初始化 Jekyll 的默认（也是首个）主题，乍一看没啥问题，就是代码高亮的背景色太丑了，得改。

找到 minima 的安装目录

```bash
$ blundle show minima
/usr/local/lib/ruby/gems/2.4.0/gems/minima-2.1.1
```

然后就可以在 `_sass/minima/` 这个目录下修改默认的样式了。