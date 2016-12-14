(function() {
	var snow = document.getElementById('snow');
	var rand = function(min, max) {
		return Math.random() * (max - min) + min;
	}
	var ctx = snow.getContext('2d');

	var w = window.innerWidth,
		h = window.innerHeight;

	snow.width = w;
	snow.height = h;

	// 雪花参数
	var arr = [],
		t = 1,
		n = 15,
		color = 'rgba(255,255,255,0.2)'

	function piece(init) {
		return {
			top: init ? rand(0, h) : 0,
			left: rand(0, w),
			size: rand(4, 10)
		}
	}

	while (n--) {
		arr.push(piece(true));
	}

	function snowing() {
		t++;
		ctx.clearRect(0, 0, w, h);

		arr.forEach(function(s, i) {
			ctx.beginPath();
			ctx.arc(s.left, s.top, s.size, 0, 2 * Math.PI, false);
			ctx.fillStyle = color;
			ctx.fill()

			s.left += 5 / s.size * Math.sin(t / 360);
			s.top += s.size / 5;

			if (s.left - s.size > w || s.top - s.size > h || s.left + s.size < 0) {
				arr.splice(i, 1, piece());
			}
		});

		requestAnimationFrame(snowing);
	}

	snowing();
})();