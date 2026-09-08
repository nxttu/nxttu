(() => {
  // Вимикаємо на сенсорних пристроях
  if ("ontouchstart" in window || navigator.maxTouchPoints > 0) return;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.style.position = "fixed";
  canvas.style.left = "0";
  canvas.style.top = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "999999";

  document.body.appendChild(canvas);

  function resize() {
    canvas.width = innerWidth * devicePixelRatio;
    canvas.height = innerHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }

  resize();
  addEventListener("resize", resize);

  const mouse = { x: innerWidth / 2, y: innerHeight / 2 };
  const vel = { x: 0, y: 0 };
  let lastX = mouse.x, lastY = mouse.y;

  const trail = [];

  let trailLength = 12;
  let pointSize = 7;
  let hue = 0;
  let hueSpeed = 1.5;

  for (let i = 0; i < trailLength; i++) {
    trail.push({ x: mouse.x, y: mouse.y });
  }

  window.addEventListener("mousemove", e => {
    vel.x = e.clientX - lastX;
    vel.y = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function updateTrail() {
    // швидкість затухає, коли курсор нерухомий — хвіст стягується до курсора
    vel.x *= 0.8;
    vel.y *= 0.8;

    trail[0].x = lerp(trail[0].x, mouse.x, 0.6);
    trail[0].y = lerp(trail[0].y, mouse.y, 0.6);

    // точки випереджають курсор у напрямку руху (хвіст веде, не відстає)
    for (let i = 1; i < trail.length; i++) {
      const tx = mouse.x + vel.x * i * 0.5;
      const ty = mouse.y + vel.y * i * 0.5;
      trail[i].x = lerp(trail[i].x, tx, 0.5);
      trail[i].y = lerp(trail[i].y, ty, 0.5);
    }
  }

  function drawTrail() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = trail.length - 1; i >= 0; i--) {

      const p = trail[i];

      const size =
        pointSize *
        (1 - i / trail.length);

      const alpha =
        1 - i / trail.length;

      ctx.beginPath();

      ctx.fillStyle =
        `hsla(${(hue + i * 8) % 360},100%,60%,${alpha})`;

      ctx.shadowBlur = 15;
      ctx.shadowColor =
        `hsl(${(hue + i * 8) % 360},100%,60%)`;

      ctx.arc(
        p.x,
        p.y,
        size,
        0,
        Math.PI * 2
      );

      ctx.fill();
    }

    hue += hueSpeed;
  }

  function animate() {
    updateTrail();
    drawTrail();
    requestAnimationFrame(animate);
  }

  animate();

  const hoverSelector =
    "a, button, input, textarea, select, .btn, [data-cursor-hover]";

  function hoverOn() {
    trailLength = 18;
    pointSize = 12;
    hueSpeed = 5;

    while (trail.length < trailLength) {
      trail.push({
        x: trail[trail.length - 1].x,
        y: trail[trail.length - 1].y
      });
    }

    canvas.style.filter =
      "brightness(1.35) saturate(1.6)";
  }

  function hoverOff() {
    trailLength = 12;
    pointSize = 7;
    hueSpeed = 1.5;

    trail.length = trailLength;

    canvas.style.filter = "";
  }

  document.addEventListener("mouseover", e => {
    if (e.target.closest(hoverSelector)) {
      hoverOn();
    }
  });

  document.addEventListener("mouseout", e => {
    if (e.target.closest(hoverSelector)) {
      hoverOff();
    }
  });

})();
