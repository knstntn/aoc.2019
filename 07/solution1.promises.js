(async () => {
    async function run(input) {
        const instructions = input.split(',').map(x => x.trim());
        console.log('>>', await calculateMaxSignal(instructions, [0, 1, 2, 3, 4]));
    }

    async function calculateMaxSignal(instructions, phases) {
        let max = 0;
        for (const phaseSettingSequence of heapsPermutations(phases)) {
            const outputs = [0];
            for (let i = 0; i < phaseSettingSequence.length; i++) {
                const inputs = [
                    Promise.resolve(phaseSettingSequence[i]),
                    Promise.resolve(outputs.pop()),
                ];
                // console.log('>>> reads', i, tmp, reads);
                await runVirtualMachine([...instructions], {
                    readFromInput: () => inputs.shift(),
                    writeToInput: (value) => outputs.push(value),
                });
            }
            // console.log('>>> outputs', outputs);
            max = Math.max(max, outputs.pop());
        }
        return max;
    }

    function* heapsPermutations(source) {
        function* heapsPermutationsMutating(source, end = source.length) {
            if (end === 1) yield [...source];

            for (var index = 0; index < end; index++) {
                yield* heapsPermutationsMutating(source, end - 1);
                swap(source, end - 1, end % 2 === 0 ? index : 0)
            }
        }

        function swap(arr, i1, i2) {
            return [arr[i1], arr[i2]] = [arr[i2], arr[i1]]
        }

        yield* heapsPermutationsMutating(source)
    }

    function parseCommand(n) {
        // console.log('>>', n);
        const s = n.toString();
        const opCode = Number(s.substring(s.length - 2));
        const modes = [];
        let i = s.length - 3;
        while (i >= 0) {
            modes.push(Number(s[i]));
            i--;
        }
        return { opCode, modes };
    }

    function runVirtualMachine(n, { readFromInput, writeToInput }) {
        return new Promise(async resolve => {
            let i = 0;
            while (true) {
                const cmd = parseCommand(n[i]);
                let j = 0;

                // console.log('>>', n[i], cmd, cmd.modes[3]);

                if (cmd.opCode === 1) {
                    const left = readFromInstructions(n, ++i, cmd.modes[j++]);
                    const right = readFromInstructions(n, ++i, cmd.modes[j++]);
                    writeToInstructions(n, ++i, left + right, cmd.modes[j++]);
                } else if (cmd.opCode === 2) {
                    const left = readFromInstructions(n, ++i, cmd.modes[j++]);
                    const right = readFromInstructions(n, ++i, cmd.modes[j++]);
                    writeToInstructions(n, ++i, left * right, cmd.modes[j++]);
                } else if (cmd.opCode === 3) {
                    n[n[++i]] = await readFromInput();
                } else if (cmd.opCode === 4) {
                    // console.log('>>> wti', n[n[i + 1]]);
                    writeToInput(n[n[++i]]);
                } else if (cmd.opCode === 5) {
                    if (readFromInstructions(n, ++i, cmd.modes[j++]) !== 0) {
                        i = readFromInstructions(n, ++i, cmd.modes[j++]);
                        continue;
                    } else {
                        ++i;
                    }
                } else if (cmd.opCode === 6) {
                    if (readFromInstructions(n, ++i, cmd.modes[j++]) === 0) {
                        i = readFromInstructions(n, ++i, cmd.modes[j++]);
                        continue;
                    } else {
                        ++i;
                    }
                } else if (cmd.opCode === 7) {
                    const left = readFromInstructions(n, ++i, cmd.modes[j++]);
                    const right = readFromInstructions(n, ++i, cmd.modes[j++]);
                    const value = left < right ? 1 : 0;
                    writeToInstructions(n, ++i, value, cmd.modes[j++]);
                } else if (cmd.opCode === 8) {
                    const left = readFromInstructions(n, ++i, cmd.modes[j++]);
                    const right = readFromInstructions(n, ++i, cmd.modes[j++]);
                    const value = left === right ? 1 : 0;
                    writeToInstructions(n, ++i, value, cmd.modes[j++]);
                } else if (cmd.opCode === 99) {
                    // console.log('>>> done');
                    resolve();
                    break;
                }
                else throw new Error(`Not supported command ${n[i]}`);

                i++;
            }
            return n;

        })
    }

    function readFromInstructions(n, i, mode) {
        return Number(mode === 1 ? n[i] : n[n[i]]);
    }

    function writeToInstructions(n, i, v, mode) {
        if (mode === 1) {
            n[i] = v;
        } else {
            n[n[i]] = v;
        }
    }

    await run("3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0");
    await run("3,23,3,24,1002,24,10,24,1002,23,-1,23, 101, 5, 23, 23, 1, 24, 23, 23, 4, 23, 99, 0, 0");
    await run("3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002, 33, 7, 33, 1, 33, 31, 31, 1, 32, 31, 31, 4, 31, 99, 0, 0, 0")
    await run("3,8,1001,8,10,8,105,1,0,0,21,38,59,84,93,110,191,272,353,434,99999,3,9,101,5,9,9,1002,9,5,9,101,5,9,9,4,9,99,3,9,1001,9,3,9,1002,9,2,9,101,4,9,9,1002,9,4,9,4,9,99,3,9,102,5,9,9,1001,9,4,9,1002,9,2,9,1001,9,5,9,102,4,9,9,4,9,99,3,9,1002,9,2,9,4,9,99,3,9,1002,9,5,9,101,4,9,9,102,2,9,9,4,9,99,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,102,2,9,9,4,9,99,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,2,9,4,9,99,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1002,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,1,9,4,9,3,9,1001,9,1,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,101,1,9,9,4,9,99,3,9,1001,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,102,2,9,9,4,9,3,9,101,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1002,9,2,9,4,9,99,3,9,101,2,9,9,4,9,3,9,1002,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,102,2,9,9,4,9,3,9,1001,9,2,9,4,9,3,9,1001,9,2,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,1,9,4,9,3,9,101,1,9,9,4,9,3,9,1001,9,1,9,4,9,99b");

    // run("3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27, 4, 27, 1001, 28, -1, 28, 1005, 28, 6, 99, 0, 0, 5");
})();