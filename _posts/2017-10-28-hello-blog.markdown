---
layout: post
title:  "Hello, BLOG"
date:   2017-10-28 14:54:37 +0800
comments: true
banner: '/assets/images/whale-lowpoly.png'
tags: life
--- 

一直以来就有写笔记的习惯，记录日常接触到的新内容，或者踩到的坑。时间一长，笔记也就多了起来。

要是分享出来，一不小心帮到别人，那也是很棒的。

那就搭个博客吧。

## 用什么搭建

其实之前试过用 [WordPress](https://cn.wordpress.org/)，主要问题是：

- 需要购买服务器（或虚拟主机） + 域名
- 国内的服务器需要备案
- 用 markdown 来写内容需要安装插件来实现
	- 当然直接复制 HTML 内容粘贴进去也是可以的，但是感觉这样有点傻

不想花钱，又不想用那些大众博客程序（太丑了好吗），自然而然关注到了 [Github Pages](https://pages.github.com/)

- 免费无限空间
- 个性域名支持

缺点是只能放置静态文件。

有想过用 [Vue](https://vuejs.org/) 做个简单的 SPA，数据放在 [LeanCloud](https://leancloud.cn/) 上，不过这样又有些问题

- 对 SEO 不友好
- 需要处理各种数据交互
- 还是没有直接解决 markdown 的问题
	- 可以利用第三方工具 [marked.js](https://github.com/chjj/marked) 对内容进行转化后通过 `v-html` 输出

所以还是用 Github Pages 官方推荐的 [Jekyll](https://jekyllrb.com/)

- 熟悉的工作流：git push = blog post
- markdwon 语法支持
- 不需要数据库

稍微花点时间了解一下 `.yml` 的配置以及 [Liquid](https://github.com/Shopify/liquid/wiki) 模板语法，直接起飞！

遇到的坑可以看这里：[使用Jekyll搭建博客的踩坑记录](/2017/10/install-jekyll)

## 模板

参考了 [Clean Blog ](https://github.com/BlackrockDigital/startbootstrap-clean-blog-jekyll/) 的样式，基于 Jekyll 的默认模板 [Minima](https://github.com/jekyll/minima) 进行二次修改，基本看不到 Minima的影子了。

看到 [WKUN](http://www.wkun.com/) 有个记录站点成长的页面非常漂亮，所以自己也增加了一个 [Time](/time/) 页面来记录博客的年龄。