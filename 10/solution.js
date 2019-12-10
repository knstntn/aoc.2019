(() => {
  function run(input) {
    const { readFileSync } = require('fs');
    const map = readFileSync(input).toString().split("\r\n");
    const asteroids = toAsteroids(map);
    const best = findBestLocation(asteroids);
    let index = 1;
    for (const vaped of generateVaporizationOrder(best.location, asteroids)) {
      // console.log('>>>', index, vaped);
      if (index === 200) {
        console.log('>>>', index, vaped);
        break;
      }

      index += 1;
    }
    // console.log(best);
  }

  function* generateVaporizationOrder(l, asteroids) {
    // console.log('>>> laser', laser);

    const targets = asteroids.filter(x => x != l).map(a => {
      return {
        asteroid: a,
        distance: Math.hypot(l.x - a.x, l.y - a.y),
        angle: Math.atan2(a.y - l.y, a.x - l.x) * (180 / Math.PI),
      };
    }).sort((a, b) => a.angle - b.angle);

    // console.log(targets);

    let lastVaporizedAngle = null;
    let i = targets.findIndex(x => x.angle === -90);
    while (true) {
      i = i % targets.length;

      if (targets[i].vaporized) {
        i++;
        continue;
      }

      if (lastVaporizedAngle === targets[i].angle) {
        i++;
        continue;
      }

      lastVaporizedAngle = targets[i].angle;
      targets[i].vaporized = 1;

      yield targets[i];

      i++;
    }
  }

  function findBestLocation(asteroids) {
    let max = Number.MIN_SAFE_INTEGER;
    let location = null;
    for (const a of asteroids) {
      let count = 0;
      for (const b of asteroids) {
        if (b === a) continue;

        const blockedBy = asteroids
          .filter(x => x !== a && x !== b)
          .filter(x => isPointOnSegment(a, x, b));
        if (blockedBy.length === 0) {
          count += 1;
        }
      }

      a.count = count;

      if (count > max) {
        max = count;
        location = a;
      }
    }
    return { location };
  }


  function isPointOnSegment(a, x, b) {
    return Math.abs(distance(a, x) + distance(x, b) - distance(a, b)) < 0.00000001;
  }

  function distance(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function toAsteroids(map) {
    const asteroids = [];
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        if (map[y][x] === '#') {
          asteroids.push({ x, y });
        }
      }
    }
    return asteroids;
  }

  // run('./input11');
  // run('./input12');
  // run('./input13');
  // run('./input14');
  run('./input16');
  // run('./input21');
})();
