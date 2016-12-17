---
title: canvas贪食蛇小游戏
date: 2016-12-16 16:56:08
tags:
---

> 源代码来源：[大概码农](http://www.qdfuns.com/house/35344.html) 发布于 [前端网](http://www.qdfuns.com/notes/35344/0c9eeaeadf670e488c8fdbe449934bd6.html)

在前端网看到的，记录下来研究下思路：

```
<canvas id="can" width="400" height="400" style="background:Black"></canvas>
<script>
/*
原理解析：
移动：根据蛇的前进方向，在末尾覆盖上黑色色块（背景色），在头部追加上绿色色块，从而使蛇移动起来
*/

var sn = [42, 41], // 蛇
	dz = 43, // 食物，黄色色块
	fx = 1, // 初始方向
	n, // 下一步方向
	ctx = document.getElementById("can").getContext("2d");
// t: 位置 c: 颜色值
function draw(t, c) {
	var x = t % 20 * 20 + 1,
		y = ~~(t / 20) * 20 + 1;

	ctx.fillStyle = c;
	ctx.fillRect(x, y, 18, 18); // x,y,width,height

	/*
		t 横向步长1 纵向步长20 区间 [0,399]
		x , y 步长20 区间[1,381]
		x 和 y 后面之所以 + 1，是为了让方块之间留有间隙

		对于 蛇 来说，t 的值由 fx 决定
	*/
}
document.onkeydown = function(e) {
	var e = e || window.event;
	if (e.preventDefault) {
		e.preventDefault();
	} else {
		e.returnValue = false;
	};

	fx = sn[1] - sn[0] == (n = [-1, -20, 1, 20][(e || event).keyCode - 37] || fx) ? fx : n;

	/*
		上面是嵌套写法，不太好读。拆开来看是这样：


		var _fx = fx; // 当前方向
		var _sn = sn[1] - sn[0]; // 当前方向的反方向
		var i = (e || event).keyCode - 37; // 方向键 keyCode 范围是37～40
		var _arr = [-1, -20, 1, 20];
		var n = _arr[i] || _fx; // 下一步的方向。若当前按下了方向键，则 n 赋新值。

		if (_sn == n) { // 如果现在的方向与下一步的相反
			// 保持前行，不能后退！
			fx = _fx;
		} else {
			fx = n;
		}

		Keycode fx 对应关系如下

		| keyCode | Direction |  fx  |
		|:-------:|:---------:|:----:|
		|  37     |   left    |  -1  |
		|  38     |   up      |  -20 |
		|  39     |   right   |  1   |
		|  40     |   down    |  20  |
	*/
};
! function() {
	// 给n赋值，并添加到sn数组头部
	n = sn[0] + fx;
	sn.unshift(n);
	if (sn.indexOf(n, 1) > 0 || n < 0 || n > 399 || fx == 1 && n % 20 == 0 || fx == -1 && n % 20 == 19) return console.log("GAME OVER"); 
	/*
		// 失败条件解读
		sn.indexOf(n, 1) > 0       撞到自身
		n < 0                      撞到上墙
		n > 399                    撞到下墙
		fx == 1 && n % 20 == 0     撞到右墙
		fx == -1 && n % 20 == 19   撞倒左墙

	*/

	// 画蛇
	draw(n, "Lime");

	if (n == dz) {
	// 吃到食物
	// 开局初始的时候蛇长度为1，dz == n == sn[0] + fx == 43，所以导致开局的时候立刻重新生成了新的食物的位置

		while (sn.indexOf(dz = ~~(Math.random() * 400)) >= 0);
		// 0 < Math.random() < 1 获取 0 到 400之间的随机数并通过~~向下取整
		// 这句有点绕，do-while 简略写法。作用是，不让新的食物的位置，出现在蛇的身体里
		// 相当于以下写法
		/*
			do {
				dz = ~~(Math.random() * 400)
			} while (sn.indexOf(dz) >= 0);
		*/

		// 画食物
		draw(dz, "Yellow");
	} else {
		// 删除数组的最后一个元素，并在该元素的位置填充黑色
		draw(sn.pop(), "Black");
	}

	// arguments.callee 当前函数的递归引用
	setTimeout(arguments.callee, 130);

	// 严格模式下无法使用arguments.callee，另外一种方式可以是：
	/*
		(function snake(){
			// ...
			setTimeout(snake, time);
		})();
	*/
}();

// referrence
// 
</script>
```
代码不多，不过能学到的东西还是挺多的。

| keyCode | Direction |  fx  |
|:-------:|:---------:|:----:|
|  37     |   left    |  -1  |
|  38     |   up      |  -20 |
|  39     |   right   |  1   |
|  40     |   down    |  20  |

###Referrence

> [arguments.callee](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/arguments/callee)