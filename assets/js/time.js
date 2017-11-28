const reSizeFont = () => {
    const o = document.documentElement;
    const w = o.clientWidth;
    if (w <= 375) {
        o.style.fontSize = '20px';
    } else if (w >= 750) {
        o.style.fontSize = '40px';
    } else {
        o.style.fontSize = w / 18.75 + 'px';
    }
}

const Counting = () => {
    const e = document.getElementById('time');
    const p = (new Date('2017/10/01 12:00:00')).getTime();
    const f = () => {
        const n = new Date().getTime();
        const r = (n - p) / 1e3;
        const d = Math.floor(r / 60 / 60 / 24);
        const h = Math.floor(r / 60 / 60) - (d * 24);
        const m = Math.floor(r / 60) - (d * 24 * 60) - (h * 60);
        const s = Math.floor(r - (d * 24 * 60 * 60) - (h * 60 * 60) - (m * 60));

        const t = `
<hgroup>
    <div class="num">${d}</div>
    <small>days</small>
</hgroup>
<hgroup>
    <div class="num">${h}</div>
    <small>hours</small>
</hgroup>
<hgroup>
    <div class="num">${m}</div>
    <small>minutes</small>
</hgroup>
<hgroup>
    <div class="num">${s}</div>
    <small>secends</small>
</hgroup>
    `;

        e.innerHTML = t;
    }

    f();
    setInterval(() => {
        f();
    }, 1e3);
}

const bubblesAnimation = () => {
    const c = document.getElementById('bubbles');
    const x = c.getContext('2d');
    const f = () => {
        c.width = window.innerWidth;
        c.height = window.innerHeight / 2;
    }
    f();

    const {
        random,
        floor,
        sin,
        cos,
        abs,
        PI
    } = Math;

    let [min, max, t, a] = [5, 15, 100, []];
    let n = floor(c.width / 100);
    const rf = (a, b) => floor(random() * (b - a) + a);
    const nb = () => ({
        r: rf(min, max),
        x: rf(0, c.width),
        y: rf(0, c.height),
        n: 0,
        m: random() * .5
    });

    while (n--) {
        a = [nb(), ...a];
    }

    const main = () => {
        x.clearRect(0, 0, c.width, c.height);
        a.forEach((o, i) => {
            let n;
            const d = o.y - o.r;

            if (d <= 0) {
                n = 0;
            } else if (d > 0 && d <= t) {
                n = .5 * (d / t);
            } else {
                n = .5;
            }

            x.beginPath();
            x.arc(o.x, o.y, o.r, 0, PI * 2, false);
            x.closePath();
            x.fillStyle = `rgba(255, 255, 255, ${o.n * n})`;
            x.fill();

            o.y = o.y - max / o.r / 3;
            o.x = o.x + sin(o.y / 100);
            if (o.n < o.m) {
                o.n = o.n + 1 / 100;
            }

            if (d < 0 || o.x + o.r < 0 || o.x - o.r > c.width) {
                a.splice(i, 1, nb());
            }
        })
        return requestAnimationFrame(main);
    }
    main();

    
    return f;
}

reSizeFont();
const reSizeCanvas = bubblesAnimation();
Counting();

window.onresize = () => {
    reSizeFont();
    reSizeCanvas();
}