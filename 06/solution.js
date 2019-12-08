(() => {
    const { readFileSync } = require('fs');

    function run(input) {
        const orbits = buildOrbitsPlan(input);
        // console.log(">>>", countOrbits(orbits));
        console.log('>>>', findCommonParent(orbits, 'YOU', 'SAN'));
    }

    function findCommonParent(orbits, left, right) {
        const comFromLeft = { [left]: -1 };
        const comFromRight = { [right]: -1 };

        // console.log(orbits);
        dfs(orbits, left, comFromLeft);
        dfs(orbits, right, comFromRight);

        // console.log(comFromRight)
        let min = Number.MAX_SAFE_INTEGER;
        for (const o of Object.keys(comFromRight)) {
            // console.log(">>", min, comFromLeft[o] + comFromRight[o]);
            if (comFromLeft[o] != undefined) {
                min = Math.min(min, comFromLeft[o] + comFromRight[o])
            }
        }
        return min;
    }

    function dfs(orbits, object, res) {
        if (!orbits[object]) return;

        for (const o of Object.keys(orbits[object])) {
            res[o] = res[object] + 1;
            dfs(orbits, o, res);
        }
    }

    function countOrbits(orbits) {
        let count = 0;
        for (const object of Object.keys(orbits)) {
            count += countOrbitsForObject(orbits, object);
        }
        return count;
    }

    function countOrbitsForObject(orbits, object) {
        if (!orbits[object]) return 0;
        // console.log('>>>', object, orbits[object]);
        let count = 0;
        for (const o of Object.keys(orbits[object])) {
            // console.log('>>', o, object);
            count += countOrbitsForObject(orbits, o);
            count += 1;
        }
        // console.log('>>>', object, orbits[object]);
        return count;
    }

    // gives back map of who orbits around who
    function buildOrbitsPlan(list) {
        const orbits = {};
        for (const line of list) {
            const [orbiter, orbitee] = line.split(')');
            orbits[orbitee] = orbits[orbitee] || {};
            orbits[orbitee][orbiter] = 1;
        }
        return orbits;
    }

    run(readFileSync('input').toString().split("\r\n").map(x => x.trim()));
    // run(readFileSync('input.test').toString().split("\r\n").map(x => x.trim()));
})();