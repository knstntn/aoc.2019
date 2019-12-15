(async () => {
  const zeroVelocity = { x: 0, y: 0, z: 0 };

  async function run(moons, steps) {
    // console.log('>>>', part1(moons, steps));
    console.log('>>>', await part2(moons));
  }

  function part1(moons, steps) {
    let i = 1;
    while (i <= steps) {
      adjustVelocity(moons);
      adjustPositions(moons);
      i += 1;
    }
    // console.log('>>', moons);
    return computeTotalEnergy(moons);
  }

  async function part2(moons) {
    const initial = moons.map(x => ({ ...x }));
    const computeDistance = (coord) => new Promise(resolve => {
      const copies = moons.map(x => ({ ...x }));
      let i = 0;
      while (true) {
        adjustVelocity(copies);
        adjustPositions(copies);
        i++;

        let valid = 0;
        for (let j = 0; j < copies.length; j++) {
          if (copies[j][coord] === initial[j][coord] && copies[j].v[coord] == 0) {
            valid += 1;
          }
        }

        if (valid === copies.length) {
          resolve(i);
          break;
        }
      }
    });
    const gcd = (a, b) => a ? gcd(b % a, a) : b;
    const lcm = (a, b) => a * b / gcd(a, b);

    const states = await Promise.all([
      computeDistance('x'),
      computeDistance('y'),
      computeDistance('z'),
    ]);

    return states.reduce((acc, s) => lcm(acc, s), 1);
  }

  function computeTotalEnergy(moons) {
    let e = 0;
    for (const m of moons) {
      e += getPotentialEnergy(m) * getKineticEnergy(m);
    }
    return e;
  }

  function getPotentialEnergy(m) {
    return getEnergy(m);
  }

  function getKineticEnergy(m) {
    return getEnergy(m.v);
  }

  function getEnergy(m) {
    return Math.abs(m.x) + Math.abs(m.y) + Math.abs(m.z);
  }

  function adjustPositions(moons) {
    for (const moon of moons) {
      moon.x += moon.v.x;
      moon.y += moon.v.y;
      moon.z += moon.v.z;
    }
  }

  function adjustVelocity(moons) {
    for (let i = 0; i < moons.length; i++) {
      const m1 = moons[i];

      for (let j = 0; j < moons.length; j++) {
        if (i == j) continue;

        m1.v = sumVelocities(m1.v, getNewVelocities(m1, moons[j]));
      }
    }
  }

  function getNewVelocities(m1, m2) {
    let v = { ...zeroVelocity };
    for (const p of ['x', 'y', 'z']) {
      v = sumVelocities(v, getVelocityDimensionalDiff(m1, m2, p));
    }
    return v;
  }

  function getVelocityDimensionalDiff(m1, m2, p) {
    const v = { ...zeroVelocity };
    const mult = m1[p] > m2[p] ? -1 : (m1[p] < m2[p] ? 1 : 0);
    v[p] += 1 * mult;
    return v;
  }

  function sumVelocities(v1, v2) {
    return {
      x: v1.x + v2.x,
      y: v1.y + v2.y,
      z: v1.z + v2.z,
    };
  }

  await run([
    { x: -1, y: 0, z: 2, v: { ...zeroVelocity } },
    { x: 2, y: -10, z: -7, v: { ...zeroVelocity } },
    { x: 4, y: -8, z: 8, v: { ...zeroVelocity } },
    { x: 3, y: 5, z: -1, v: { ...zeroVelocity } },
  ], 10);

  await run([
    { x: -8, y: -10, z: 0, v: { ...zeroVelocity } },
    { x: 5, y: 5, z: 10, v: { ...zeroVelocity } },
    { x: 2, y: -7, z: 3, v: { ...zeroVelocity } },
    { x: 9, y: -8, z: -3, v: { ...zeroVelocity } },
  ], 100);
 
  run([
    { x: -8, y: -18, z: 6, v: { ...zeroVelocity } },
    { x: -11, y: -14, z: 4, v: { ...zeroVelocity } },
    { x: 8, y: -3, z: -10, v: { ...zeroVelocity } },
    { x: -2, y: -16, z: 1, v: { ...zeroVelocity } },
  ], 1000);
})();