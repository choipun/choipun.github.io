---
layout: post
title:  "Vue CLI 3 + Laravel 混合部署"
date:   2019-11-18 21:16:00 +0800
comments: true
tags: web vue
---

## 需求说明

使用 Laravel 提供 API 服务，并使用 Vue CLI 构建前端页面。最终生成的静态页面作为 Laravel 的模板。

## 过程

使用 Laravel 命令创建项目并进入项目文件夹。

```bash
Laravel new my-project
cd my-project
```

在 Laravel 项目文件夹中移除前端脚手架，并创建 Vue 项目

```bash
rm -rf package.json webpack.mix.js yarn.lock resources/assets
vue create frontend
```

创建 **frontend/vue.config.js**

```js
module.exports = {
  // 在开发期间设置代理转发API请求
  devServer: {
    proxy: 'http://laracon.test'
  },

  // 输出构建好的静态文件到 Laravel 的 public 目录下
  outputDir: '../public',

  // 修改生成的 HTML 文件的位置，确保只在生产环境才这样
  indexPath: process.env.NODE_ENV === 'production'
    ? '../resources/views/index.blade.php'
    : 'index.html'
}
```

**frontend/package.json**

```diff
"scripts": {
  "serve": "vue-cli-service serve",
- "build": "vue-cli-service build",
+ "build": "rm -rf ../public/{js,css,img} && vue-cli-service build --no-clean",
  "lint": "vue-cli-service lint"
},
```

配置 Laravel

**routes/web.php**

```php
<?php

Route::get('/', 'SpaController@index');
```

**app/Http/Controllers/SpaController.php**

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SpaController extends Controller
{
    public function index()
    {
        return view('index');
    }
}
```

参考与致谢：

[Laravel + Vue CLI 3](https://github.com/yyx990803/laravel-vue-cli-3)