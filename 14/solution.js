(() => {
  function part1(input, answer) {
    const ingredients = getInputIngredients(input);
    const storage = {};
    const stack = [];
    const putDepsOnStack = (name) => {
      for (const d of Object.keys(ingredients[name].deps)) {
        stack.push({ name: d, amount: ingredients[name].deps[d] });
      }
    };
    putDepsOnStack('FUEL');
    let ore = 0;
    while (stack.length) {
      const { name, amount } = stack.pop();
      if (name === 'ORE') {
        ore += amount;
        continue;
      }

      if (storage[name] >= amount) {
        storage[name] -= amount;
        continue;
      }

      const willBeProduced = ingredients[name].amount;
      if (willBeProduced < amount) {
        stack.push({ name: name, amount: amount - willBeProduced })
      } else if (willBeProduced > amount) {
        storage[name] = storage[name] || 0;
        storage[name] += willBeProduced - amount;
      }

      putDepsOnStack(name);
    }

    console.log('>>', ore, answer, ore === answer);
  }

  function getInputIngredients(input) {
    const { readFileSync } = require('fs');
    const ingredients = {};
    readFileSync(input).toString().split("\r\n").map(line => {
      if (!line) return;
      const [left, right] = line.split("=>").map(x => x.trim());
      const [amount, name] = right.split(' ').map(x => x.trim());
      ingredients[name.toUpperCase()] = {
        amount: Number(amount),
        deps: left.split(',').map(x => x.trim()).reduce((acc, d) => {
          const [amount, name] = d.split(' ').map(x => x.trim());
          acc[name.toUpperCase()] = Number(amount);
          return acc;
        }, {})
      };
    });
    return ingredients;
  }

  part1('input1', 31);
  part1('input2', 165);
  part1('input3', 13312);
  part1('input4', 180697);
  part1('input5', 2210736);
  part1('puzzle');
})();
