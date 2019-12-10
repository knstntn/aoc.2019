(() => {
    function run(input) {
        const { readFileSync } = require('fs');
        const map = readFileSync(input).toString().split("\r\n");
        const asteroids = toAsteroids(map);
        const best = findBestLocation(asteroids);
        console.log(best);
    }

    function generateVaporizationOrder(laser, asteroids) {
        
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
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
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

    run('./input1');
    run('./input2');
    run('./input3');
    run('./input4');
    run('./input5');
    run('./input6');
})();
