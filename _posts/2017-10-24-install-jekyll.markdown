---
layout: post
title:  "安装 Jekyll 踩坑记录"
date:   2017-10-24 21:19:37 +0800
---
Transform your plain text into static websites and blogs.

[jekyllrb.com](http://jekyllrb.com/)

## 安装

需要有**完整的** Ruby 开发环境，[前置需求看这里](https://jekyllrb.com/docs/installation/#requirements)

太（bu）长（dong）不（ying）看（yu）的，就愉快地跟我一起踩坑吧

```bash
$ gem install jekyll
```

macOS 会遇到这个坑

```bash
Fetching: public_suffix-3.0.0.gem (100%)
ERROR:  While executing gem ... (Gem::FilePermissionError)
    You don't have write permissions for the /Library/Ruby/Gems/2.3.0 directory.
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

然后可以了？当然还是没有那么顺利

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

## 基础用法

### 本机预览

```bash
$ jekyll serve
```

一个开发服务器将会运行在 http://localhost:4000/

Auto-regeneration（自动再生成文件）: 开启。使用 `--no-watch` 来关闭

```
$ jekyll serve --detach
```
功能和`jekyll serve`命令相同，但是会脱离终端在后台运行

如果你想关闭服务器，可以使用 `kill -9 1234` 命令，**1234** 是进程号（PID）

如果你找不到进程号，那么就用 `ps aux | grep jekyll` 命令来查看，然后关闭服务器。[更多](http://unixhelp.ed.ac.uk/shell/jobz5.html).

### 构建

```bash
$ jekyll build
```

当前文件夹中的内容将会生成到 `./_site` 文件夹中


```bash
$ jekyll build --destination <destination>
```

当前文件夹中的内容将会生成到目标文件夹<destination>中

```bash
$ jekyll build --source <source> --destination <destination>
```

指定源文件夹<source>中的内容将会生成到目标文件夹<destination>中

```bash
$ jekyll build --watch
```

当前文件夹中的内容将会生成到 `./_site` 文件夹中，查看改变，并且自动再生成

模板语法啥的，直接看官网就好了。

**开始浪吧！**