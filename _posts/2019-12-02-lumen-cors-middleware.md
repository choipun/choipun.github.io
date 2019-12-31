---
layout: post
title:  "Lumen 设置 CORS 实现跨域的配置"
date:   2019-12-02 16:36:00 +0800
comments: true
tags: web
---

本文主要记录使用中间件来解决的方案。

创建 **app/Http/Middleware/Cors.php**

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class Cors
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $headers = [
            'Access-Control-Allow-Origin' => '*',
            'Access-Control-Allow-Methods' => 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers' => $request->header('Access-Control-Request-Headers'),
            'Access-Control-Allow-Credentials' => 'true',//允许客户端发送cookie
            'Access-Control-Max-Age' => 1728000 //该字段可选，用来指定本次预检请求的有效期，在此期间，不用发出另一条预检请求。
        ];

        $response = $next($request);
        return $response->withHeaders($headers);
    }

}
```

注册路由中间件 **bootstrap/app.php**

```php
$app->routeMiddleware([
    'cors' =>  App\Http\Middleware\Cors::class,
    // ... 其他中间件
]);
```

在需要跨域的路由上使用中间件 **routes/web.php**

```php
$router->group(['middleware' => 'cors'], function () use ($router) {
    
});
```