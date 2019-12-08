const numbers = require('./input.json');

// const p1202 = make1202Program([...numbers]);
// const processed = processCommands(p1202);

function findPair(numbers) {
    for (var n = 0; n <= 99; n++) {
        for (var v = 0; v <= 99; v++) {
            const res = makeProgram([...numbers], n, v);
            const processed = processCommands(res);

            if (processed[0] === 19690720) {
                console.log(n, v, 100*n + v);
            }
        }
    }
}

findPair(numbers);

function make1202Program(numbers) {
    return makeProgram(numbers, 12, 2);
}

function makeProgram(numbers, noun, verb) {
    numbers[1] = noun;
    numbers[2] = verb;
    return numbers;
}

function processCommands(n) {
    let i = 0;
    while (true) {
        if (n[i] === 1) {
            const left = n[n[++i]];
            const right = n[n[++i]];
            n[n[++i]] = left + right;
        } else if (n[i] === 2) {
            const left = n[n[++i]];
            const right = n[n[++i]];
            n[n[++i]] = left * right;
        } else if (n[i] === 99) {
            break;
        }
        else throw new Error(`Not supported command ${n[i]}`);

        i++;
    }
    return n;
}
