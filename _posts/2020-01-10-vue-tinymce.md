---
layout: post
title:  "Vue 3 + Tinymce 5 实现富文本编辑器"
date:   2020-01-10 20:01:00 +0800
comments: true
tags: web vue
---

[Tinymce](https://www.tiny.cloud/) 是一个比较多人推荐的富文本编辑器，不过我在用的过程中也是踩了不少坑，这里记录一下。

官网是提供了和Vue搭配食用的教学的 [Vue integration](https://www.tiny.cloud/docs/integrations/vue/)，但是按照这个流程走会有如下提示：

> This domain is not registered with Tiny Cloud. Start a free trial to discover our premium cloud services and pro support.

因为我实在是懒得注册去获得这个 `api-key`，而且这个流程所有的插件都是单独下载的，会发起一堆请求，所以我决定换其他方式来使用。

### 安装


```bash
npm install tinymce --save-dev
npm install @tinymce/tinymce-vue --save-dev
```

一个是核心文件，一个是官方提供的适配。

### 基础代码

结构如下

HTML

```html
<template>
  <div class="app-container">
    <editor v-model="content" :init="init" />
  </div>
</template>
```

JS

```js
import tinymce from 'tinymce'
import Editor from '@tinymce/tinymce-vue'
import config from './config'

export default {
  components: {
    Editor
  },
  data() {
    return {
      content: '<p>This is the initial content of the editor</p>',
      init: config
    }
  },
  mounted() {
    tinymce.init({})
  }
}
```

### 配置文件 config

基本上还是照着上文提到的 [Vue integration](https://www.tiny.cloud/docs/integrations/vue/) 去配置即可，但是有几个注意的地方。

汉化包、主题样式等静态文件我是直接上传到了服务器当中（并非使用下文的 `process.env.BASE_URL`），省得考虑本地环境与开发的路径问题。

如果没有设置，那会默认以 `localhost:9528` 开头去加载文件，那肯定是找不到文件导致报错了。

插件在使用之前需要先引入，否则也是会加载远程文件。

完整配置参考如下：

```js
import 'tinymce/themes/silver'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/table'
import 'tinymce/plugins/code'
import 'tinymce/plugins/help'
import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/searchreplace'

export default {
  language_url: process.env.BASE_URL + `/tinymce/zh_CN.js`,
  language: 'zh_CN',
  height: 500,
  menubar: false,
  branding: false, // 去水印
  elementpath: false, // 禁用编辑器底部的状态栏
  statusbar: false, // 隐藏编辑器底部的状态栏
  paste_data_images: true, // 允许粘贴图像
  skin_url: process.env.BASE_URL + '/tinymce/skins/ui/oxide', // skin 路径
  content_css: process.env.BASE_URL + '/tinymce/skins/content/default/content.min.css', // content.css 路径
  plugins: [
    'table code help fullscreen image link preview lists searchreplace'
  ],
  toolbar: `
    newdocument | undo redo | 
    formatselect | 
    bold italic backcolor | 
    alignleft aligncenter alignright alignjustify | 
    bullist numlist outdent indent | 
    table image link | 
    removeformat searchreplace | 
    code preview fullscreen help
  `
}
```

### 销毁

离开页面之前先销毁现有的 tinymce 实例：

在 DOM 上面加个 `id` 属性

```html
<editor id="tinymce-editor" v-model="content" :init="init" />
```

加上 `beforeDestroy` 这个生命周期，在离开页面之前销毁实例

```js
beforeDestroy() {
  if (tinymce) {
    const editor = tinymce.get('tinymce-editor')
    editor.destroy()
  }
}
```

至此也就差不多了，其他根据需求再自定义即可。

感谢阅读。