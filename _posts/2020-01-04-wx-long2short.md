---
layout: post
title:  "检测域名是否被微信封禁"
date:   2020-01-04 19:33:00 +0800
comments: true
tags: web security
---

当域名被微信封禁时，访问的链接会先经过微信服务器检测，如果正常就放行，否则会重定向跳转到下面这个链接（右键在新窗口打开，修改这个链接的参数，有趣的现象会发生）

[https://weixin110.qq.com/cgi-bin/mmspamsupport-bin/...](https://weixin110.qq.com/cgi-bin/mmspamsupport-bin/newredirectconfirmcgi?main_type=2&evil_type=20&source=2&url=https://baidu.com)

如果我们能够让微信自己的域名经过微信的检测，那么这件事就成了。翻遍了微信官方各种api，功夫不负有心人，找到了「**长链接转短链接接口**」，可以把我们的链接转成微信自己的链接，这样判断短链接的重定向链接即可得知是否被封禁。

长链转短链需要三个参数

- `access_token` 
- `action`
- `long_url`

关键的问题来了， `access_token` 是从微信获取来的，获取 `access_token` 需要在微信后台配置白名单，并且每天限额是1000000次 `access_token` 是公众号的全局唯一接口调用凭据，公众号调用各接口时都需使用 `access_token` 但是，很多网站是没有公众号的，或者说100万的调用次数都不够我挥霍的，那怎么办？答案是我们可以使用微信公众平台测试账号，它的优势是无需公众帐号、快速申请接口（只要有微信号就可以），可以直接体验和测试公众平台所有高级接口功能，而且不需要绑定ip白名单也可以获得 `access_token` ，最大的优势是长链转短链的服务貌似没有调用次数限制（我亲测试了很多，发现使用次数并没有变化，虽然文档上写了1000次）。

微信公众平台测试账号链接：[https://mp.weixin.qq.com/debug/...](https://mp.weixin.qq.com/debug/cgi-bin/sandboxinfo?action=showinfo&t=sandbox/index)

所有的准备工作已经ready，那么可以show代码了获取 `access_token` 

```
/**
 * 根据appid和app appsecret来获取acess_token
 * return @param {String}
 */
async getAccessToken() {
    let query = {
        appid: this.appid,
        secret: this.appsecret,
        grant_type: 'client_credential'
    };
     
    let url = `https://api.weixin.qq.com/cgi-bin/token?${querystring.stringify(query)}`;
    return await this.request(url);
}
```

长链转短链

```
/**
 * 通过微信api生成短链
 * @param {String} req_url 待检测url
 */
async createShortUrl(req_url) {
    var requestData = {
        "access_token": this.access_token,
        "action": "long2short",
        "long_url": req_url
    }
    const url = `https://api.weixin.qq.com/cgi-bin/shorturl?access_token=${this.access_token}`;
    let body = await this.request(url, {
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json",
        },
        body: requestData
    });
 
 
    return body && body.short_url;
}
```
检测重定向链接来判断是否被微信封禁

```
/**
 * 根据重定向之后的host是否为weixin110.qq.com来检测url是否被微信封禁
 * @param {String} url 待检测短链接url
 */
checkDomainBanned(url) {
    return new Promise(function (resolve, reject) {
        return request(url, function(err, res, body) {
            if (!err) {
                if (res && res.request && res.request.uri && res.request.uri.host === 'weixin110.qq.com') {
                    resolve({ code: -1, msg: 'banned' });
                } else {
                    resolve({ code: 0, msg: 'ok' });
                }
            } else {
                reject(err);
            }
        })
    })
}
```

## 致谢

> 来源：知乎 作者：唐静鑫