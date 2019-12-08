const { readFileSync } = require('fs');

const numbers = readFileSync('input').toString().split("\r\n").map(x => Number(x));

let hrstart = process.hrtime();
const res1 = calculateFuel1([...numbers]);
let hrend = process.hrtime(hrstart);
console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000);

const av2 = [];
const av3 = [];

for (let i = 0; i < 100000; i++) {
    hrstart = process.hrtime();
    calculateFuel2([...numbers]);
    hrend = process.hrtime(hrstart);
    av2.push(hrend);

    hrstart = process.hrtime();
    calculateFuel3(numbers);
    hrend = process.hrtime(hrstart);
    av3.push(hrend);
}

console.info('Execution time v2 (hr): %dms', (av2.reduce((a, b) => a + b[1], 0) / av2.length) / 1000000);
console.info('Execution time v3 (hr): %dms', (av3.reduce((a, b) => a + b[1], 0) / av3.length) / 1000000);

function calculateFuel1(numbers) {
    return numbers.map(x => Math.floor(x / 3) - 2).reduce((a, b) => a + b);
}

function calculateFuel2(numbers) {
    let res = 0;
    while (numbers.length) {
        const num = numbers.pop();
        const val = Math.floor(num / 3) - 2;
        if (val > 0) {
            res += val;
            numbers.push(val);
        }
    }
    return res;
}
function calculateFuel(mass) {
    const fuelNeeded = Math.floor(mass / 3) - 2;

    if (fuelNeeded < 0) {
        return 0;
    }

    return fuelNeeded + calculateFuel(fuelNeeded);
};

function calculateFuel3(numbers) {
    let total = 0; 
    for (const mass of numbers) {
        total += calculateFuel(mass);
    }
    return total;
}

//console.log(res1, res2, res3);

module.exports = {
    calculateFuel1,
    calculateFuel2,
};