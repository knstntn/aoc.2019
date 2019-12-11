(() => {
  function runVirtualMachine(arr, { readFromInput, writeToInput }) {
    return new Promise(async resolve => {
      const code = objectify(arr);
      let i = 0;
      let rv = 0;
      while (true) {
        const cmd = parseCommand(code[i]);
        let j = 0;
        if (cmd.opCode === 1) {
          const left = readFromInstructions(code, rv, ++i, cmd.modes[j++]);
          const right = readFromInstructions(code, rv, ++i, cmd.modes[j++]);
          writeToInstructions(code, rv, ++i, left + right, cmd.modes[j++]);
        } else if (cmd.opCode === 2) {
          const left = readFromInstructions(code, rv, ++i, cmd.modes[j++]);
          const right = readFromInstructions(code, rv, ++i, cmd.modes[j++]);
          writeToInstructions(code, rv, ++i, left * right, cmd.modes[j++]);
        } else if (cmd.opCode === 3) {
          const value = readFromInput();
          if (value != null) {
            writeToInstructions(code, rv, ++i, value, cmd.modes[j++]);
          } else {
            await new Promise(resolve => process.nextTick(resolve));
            continue;
          }
        } else if (cmd.opCode === 4) {
          const value = readFromInstructions(code, rv, ++i, cmd.modes[j++]);
          writeToInput(value);
        } else if (cmd.opCode === 5) {
          if (readFromInstructions(code, rv, ++i, cmd.modes[j++]) !== 0) {
            i = readFromInstructions(code, rv, ++i, cmd.modes[j++]);
            continue;
          } else {
            ++i;
          }
        } else if (cmd.opCode === 6) {
          if (readFromInstructions(code, rv, ++i, cmd.modes[j++]) === 0) {
            i = readFromInstructions(code, rv, ++i, cmd.modes[j++]);
            continue;
          } else {
            ++i;
          }
        } else if (cmd.opCode === 7) {
          const left = readFromInstructions(code, rv, ++i, cmd.modes[j++]);
          const right = readFromInstructions(code, rv, ++i, cmd.modes[j++]);
          const value = left < right ? 1 : 0;
          writeToInstructions(code, rv, ++i, value, cmd.modes[j++]);
        } else if (cmd.opCode === 8) {
          const left = readFromInstructions(code, rv, ++i, cmd.modes[j++]);
          const right = readFromInstructions(code, rv, ++i, cmd.modes[j++]);
          const value = left === right ? 1 : 0;
          writeToInstructions(code, rv, ++i, value, cmd.modes[j++]);
        } else if (cmd.opCode === 9) {
          rv += readFromInstructions(code, rv, ++i, cmd.modes[j++]);
        } else if (cmd.opCode === 99) {
          resolve();
          break;
        } else throw new Error(`Not supported command ${code[i]}`);

        i++;
      }
    });
  }

  function objectify(arr) {
    return arr.reduce((acc, val, i) => {
      acc[i] = val;
      return acc;
    }, {});
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

  function readFromInstructions(code, rv, i, mode) {
    if (mode === 1) {
      return Number(code[i] || 0);
    }
    if (mode === 2) {
      const index = rv + Number(code[i]);
      return Number(code[index] || 0);
    }
    return Number(code[code[i]] || 0);
  }

  function writeToInstructions(code, rv, i, v, mode) {
    if (Number(i) < 0) throw new Error("It is invalid to try to access memory at a negative address");

    if (mode === 1) {
      code[i] = v;
      return;
    }

    if (mode === 2) {
      const index = rv + Number(code[i]);
      code[index] = v;
      return;
    }

    code[code[i]] = v;
  }

  module.exports = {
    runVirtualMachine,
  };
})()