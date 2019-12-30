---
layout: post
title:  "使用 Gulp 自动转化 ES6 语法"
date:   2017-09-09 15:22:00 +0800
comments: true
tags: web
---

## 需求

- 使用ES6语法
- ES6 => ES5 自动转化
- 压缩代码

核心工具

- Gulp
- babel
- webpack

## 配置参考

package.json

```json
{
  "name": "src",
  "version": "1.0.0",
  "description": "",
  "main": "gulpfile.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "dependencies": {
    "babel-core": "^6.26.0",
    "babel-preset-env": "^1.6.0",
    "gulp": "^3.9.1",
    "gulp-babel": "^7.0.0",
    "gulp-rename": "^1.2.2",
    "gulp-uglify": "^3.0.0",
    "pump": "^1.0.2",
    "webpack": "^3.5.6",
    "webpack-stream": "^4.0.0"
  },
  "author": "",
  "license": "ISC"
}

```

gulpfile.js

```javascript
const gulp = require('gulp');
const webpack = require('webpack-stream');
const babel = require("gulp-babel");
const uglify = require('gulp-uglify');
const pump = require('pump');
const rename = require('gulp-rename');

const config = {
  output: {
    filename: "bundler.js",
  }
}

gulp.task('default', () => {
  console.log(`
gulp watch: 检测 js/index.js 的改动，由 babel 转码后生成 js/bundler.js
gulp mini:  压缩并混淆 js/bundler.js 生成 js/bundler.min.js
  `);
})

gulp.task('watch', () => {
  config.watch = true;
  return gulp.src('js/index.js')
    .pipe(webpack(config))
    .pipe(babel())
    .pipe(gulp.dest('js/'));
})

gulp.task('mini', () => {
  pump([
    gulp.src('js/bundler.js')
    .pipe(rename({
      suffix: '.min'
    })),
    uglify(),
    gulp.dest('js/')
  ]);
})
```

.babelrc

```json
{
  "presets": ["env"]
}
```