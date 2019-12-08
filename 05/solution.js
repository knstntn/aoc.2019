(() => {
    function run(input) {
        const instructions = input.split(',').map(x => x.trim());

        // console.log(parseCommand('1101'));

        processCommands(instructions);
    }

    function parseCommand(n) {
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

    function processCommands(n) {
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
                n[n[++i]] = readFromInput();
            } else if (cmd.opCode === 4) {
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
                break;
            }
            else throw new Error(`Not supported command ${n[i]}`);

            i++;
        }
        return n;
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

    function readFromInput() {
        // return 1;
        return 5;
    }

    function writeToInput(num) {
        console.log(num);
    }

    // run("3,9,8,9,10,9,4,9,99,-1,8")
    run("3,225,1,225,6,6,1100,1,238,225,104,0,1101,61,45,225,102,94,66,224,101,-3854,224,224,4,224,102,8,223,223,1001,224,7,224,1,223,224,223,1101,31,30,225,1102,39,44,224,1001,224,-1716,224,4,224,102,8,223,223,1001,224,7,224,1,224,223,223,1101,92,41,225,101,90,40,224,1001,224,-120,224,4,224,102,8,223,223,1001,224,1,224,1,223,224,223,1101,51,78,224,101,-129,224,224,4,224,1002,223,8,223,1001,224,6,224,1,224,223,223,1,170,13,224,101,-140,224,224,4,224,102,8,223,223,1001,224,4,224,1,223,224,223,1101,14,58,225,1102,58,29,225,1102,68,70,225,1002,217,87,224,101,-783,224,224,4,224,102,8,223,223,101,2,224,224,1,224,223,223,1101,19,79,225,1001,135,42,224,1001,224,-56,224,4,224,102,8,223,223,1001,224,6,224,1,224,223,223,2,139,144,224,1001,224,-4060,224,4,224,102,8,223,223,101,1,224,224,1,223,224,223,1102,9,51,225,4,223,99,0,0,0,677,0,0,0,0,0,0,0,0,0,0,0,1105,0,99999,1105,227,247,1105,1,99999,1005,227,99999,1005,0,256,1105,1,99999,1106,227,99999,1106,0,265,1105,1,99999,1006,0,99999,1006,227,274,1105,1,99999,1105,1,280,1105,1,99999,1,225,225,225,1101,294,0,0,105,1,0,1105,1,99999,1106,0,300,1105,1,99999,1,225,225,225,1101,314,0,0,106,0,0,1105,1,99999,1008,677,226,224,102,2,223,223,1006,224,329,101,1,223,223,108,677,677,224,102,2,223,223,1005,224,344,101,1,223,223,107,677,677,224,1002,223,2,223,1005,224,359,101,1,223,223,1107,226,677,224,1002,223,2,223,1005,224,374,1001,223,1,223,1008,677,677,224,102,2,223,223,1006,224,389,1001,223,1,223,1007,677,677,224,1002,223,2,223,1006,224,404,1001,223,1,223,8,677,226,224,102,2,223,223,1005,224,419,1001,223,1,223,8,226,226,224,102,2,223,223,1006,224,434,101,1,223,223,1107,226,226,224,1002,223,2,223,1006,224,449,101,1,223,223,1107,677,226,224,102,2,223,223,1005,224,464,101,1,223,223,1108,226,226,224,102,2,223,223,1006,224,479,1001,223,1,223,7,677,677,224,1002,223,2,223,1006,224,494,101,1,223,223,7,677,226,224,102,2,223,223,1005,224,509,101,1,223,223,1108,226,677,224,1002,223,2,223,1006,224,524,101,1,223,223,8,226,677,224,1002,223,2,223,1005,224,539,101,1,223,223,1007,226,226,224,102,2,223,223,1006,224,554,1001,223,1,223,108,226,226,224,1002,223,2,223,1006,224,569,1001,223,1,223,1108,677,226,224,102,2,223,223,1005,224,584,101,1,223,223,108,226,677,224,102,2,223,223,1005,224,599,101,1,223,223,1007,226,677,224,102,2,223,223,1006,224,614,1001,223,1,223,1008,226,226,224,1002,223,2,223,1006,224,629,1001,223,1,223,107,226,226,224,1002,223,2,223,1006,224,644,101,1,223,223,7,226,677,224,102,2,223,223,1005,224,659,1001,223,1,223,107,677,226,224,102,2,223,223,1005,224,674,1001,223,1,223,4,223,99,226");
})();
