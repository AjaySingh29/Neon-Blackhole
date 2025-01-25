function createStars(numStars) {
  const starSize = 30;
  const starPadding = 5;
  const stars = [];

  for (let i = 0; i < numStars; i++) {
    let x, y;
    let overlapping;

    do {
      overlapping = false;
      x = Math.floor(Math.random() * (window.innerWidth - starSize));
      y = Math.floor(Math.random() * (window.innerHeight - starSize));

      for (const star of stars) {
        const dx = star.x - x;
        const dy = star.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < starSize + starPadding) {
          overlapping = true;
          break;
        }
      }
    } while (overlapping);

    stars.push({ x, y });

    const star = document.createElement("div");
    star.classList.add("star");
    star.style.top = `${y}px`;
    star.style.left = `${x}px`;
    document.body.appendChild(star);
  }
}

// Call the function to create stars
createStars(50);

function stars() {
  let stars = document.querySelectorAll(".star");
  anime({
    targets: ".star",
    scale: function () {
      return anime.random(0.7, 0.9);
    },
    easing: "linear",
    duration: 2000,
    loop: true,
    direction: "alternate",
  });
}
stars();

function createTrail(x, y) {
  const trail = document.createElement("div");
  trail.classList.add("trail");
  trail.style.left = `${x - 10}px`;
  trail.style.top = `${y - 10}px`;
  document.body.appendChild(trail);

  trail.addEventListener("animationend", () => {
    trail.remove();
  });
}

function createBlackHole(x, y) {
  const blackhole = document.createElement("div");
  blackhole.classList.add("blackhole");
  blackhole.style.left = `${x - 10}px`;
  blackhole.style.top = `${y - 10}px`;
  document.body.appendChild(blackhole);

  const stars = Array.from(document.querySelectorAll(".star"));
  stars
    .map((star) => {
      const starX = parseFloat(star.style.left);
      const starY = parseFloat(star.style.top);
      const dx = x - starX;
      const dy = y - starY;
      return { star, distance: Math.sqrt(dx * dx + dy * dy) };
    })
    .sort((a, b) => a.distance - b.distance)
    .forEach(({ star }, index) => {
      setTimeout(() => {
        star.style.transition = "1s linear";
        star.style.left = `${x}px`;
        star.style.top = `${y}px`;

        setTimeout(() => {
          star.remove();
        }, 1000);
      }, index * 60); // Delay based on distance
    });

  blackhole.addEventListener("animationend", () => {
    blackhole.remove();
  });
}

let mouseTrailPositions = [];

function updateTrail() {
  if (mouseTrailPositions.length > 0) {
    const { x, y } = mouseTrailPositions.shift();
    createTrail(x, y);
  }
  requestAnimationFrame(updateTrail);
}

window.addEventListener("mousemove", (e) => {
  mouseTrailPositions.push({ x: e.clientX, y: e.clientY });
});

window.addEventListener("click", (e) => {
  createBlackHole(e.clientX, e.clientY);
});

requestAnimationFrame(updateTrail);
