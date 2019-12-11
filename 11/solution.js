(async () => {
  const vm = require('./vm');

  const BLACK = '0';
  const WHITE = '1';

  const RIGHT = 1;
  const LEFT = 0;

  const DIR_UP = 0;
  const DIR_DOWN = 1;
  const DIR_LEFT = 2;
  const DIR_RIGHT = 3;

  const OP_COLORIFY = 0;
  const OP_TURN = 1;

  const map = new Map();
  let robot_op = OP_COLORIFY
  const robot = { x: 0, y: 0, c: BLACK, d: DIR_UP };
  const sizes = { x: { min: 0, max: 0 }, y: { min: 0, max: 0 } };

  async function run(input) {
    const instructions = input.split(',').map(x => x.trim());
    await vm.runVirtualMachine(instructions, {
      readFromInput: () => {
        if (!map.has(pointToString(robot))) {
          map.set(pointToString(robot), BLACK);

        }
        return map.get(pointToString(robot));
      },
      writeToInput: (value) => {
        if (robot_op === OP_COLORIFY) {
          robot.c = value;
          robot_op = OP_TURN;
          map.set(pointToString(robot), robot.c);
        } else if (robot_op === OP_TURN) {
          moveRobot(value);
          robot_op = OP_COLORIFY;
        }
      },
    });
    console.log('>>>', map.size, sizes);
  }

  function moveRobot(value) {
    // console.log('>> move', robot, value);
    if (robot.d == DIR_UP) {
      if (value == LEFT) {
        robot.d = DIR_LEFT
        robot.x -= 1;
      } else if (value == RIGHT) {
        robot.d = DIR_RIGHT
        robot.x += 1;
      } else throw new Error(`Cannot turn from up to ${value}`);
    } else if (robot.d == DIR_DOWN) {
      if (value == LEFT) {
        robot.d = DIR_RIGHT
        robot.x += 1;
      } else if (value === RIGHT) {
        robot.d = DIR_LEFT
        robot.x -= 1;
      } else throw new Error(`Cannot turn from up to ${value}`);
    } else if (robot.d == DIR_LEFT) {
      if (value == LEFT) {
        robot.d = DIR_DOWN
        robot.y -= 1;
      } else if (value == RIGHT) {
        robot.d = DIR_UP
        robot.y += 1;
      } else throw new Error(`Cannot turn from up to ${value}`);
    } else if (robot.d == DIR_RIGHT) {
      if (value == LEFT) {
        robot.d = DIR_UP
        robot.y += 1;
      } else if (value == RIGHT) {
        robot.d = DIR_DOWN
        robot.y -= 1;
      } else throw new Error(`Cannot turn from up to ${value}`);
    } else throw new Error(`Cannot turn from that direction ${robot.d}`);

    sizes.x.max = Math.max(sizes.x.max, robot.x);
    sizes.x.min = Math.min(sizes.x.min, robot.x);

    sizes.y.max = Math.max(sizes.y.max, robot.y);
    sizes.y.min = Math.min(sizes.y.min, robot.y);
  }

  function pointToString(point) {
    return `x: ${point.x} : y ${point.y}`;
  }

  await run("3,8,1005,8,358,1106,0,11,0,0,0,104,1,104,0,3,8,102,-1,8,10,1001,10,1,10,4,10,1008,8,1,10,4,10,101,0,8,29,1,1104,7,10,3,8,102,-1,8,10,1001,10,1,10,4,10,108,0,8,10,4,10,1002,8,1,54,1,103,17,10,1,7,3,10,2,8,9,10,3,8,102,-1,8,10,1001,10,1,10,4,10,1008,8,1,10,4,10,102,1,8,89,1,1009,16,10,1006,0,86,1006,0,89,1006,0,35,3,8,102,-1,8,10,101,1,10,10,4,10,1008,8,0,10,4,10,102,1,8,124,1,105,8,10,1,2,0,10,1,1106,5,10,3,8,1002,8,-1,10,101,1,10,10,4,10,1008,8,0,10,4,10,1001,8,0,158,1,102,2,10,1,109,17,10,1,109,6,10,1,1003,1,10,3,8,1002,8,-1,10,101,1,10,10,4,10,108,1,8,10,4,10,1001,8,0,195,1006,0,49,1,101,5,10,1006,0,5,1,108,6,10,3,8,102,-1,8,10,1001,10,1,10,4,10,1008,8,0,10,4,10,102,1,8,232,2,1102,9,10,1,1108,9,10,3,8,1002,8,-1,10,101,1,10,10,4,10,1008,8,1,10,4,10,1002,8,1,262,1006,0,47,3,8,1002,8,-1,10,101,1,10,10,4,10,108,0,8,10,4,10,101,0,8,286,1006,0,79,2,1003,2,10,2,107,0,10,1006,0,89,3,8,1002,8,-1,10,101,1,10,10,4,10,1008,8,1,10,4,10,101,0,8,323,1006,0,51,2,5,1,10,1,6,15,10,2,1102,3,10,101,1,9,9,1007,9,905,10,1005,10,15,99,109,680,104,0,104,1,21101,838211572492,0,1,21101,0,375,0,1106,0,479,21102,1,48063328668,1,21102,386,1,0,1106,0,479,3,10,104,0,104,1,3,10,104,0,104,0,3,10,104,0,104,1,3,10,104,0,104,1,3,10,104,0,104,0,3,10,104,0,104,1,21102,1,21679533248,1,21101,0,433,0,1105,1,479,21102,235190455527,1,1,21102,444,1,0,1106,0,479,3,10,104,0,104,0,3,10,104,0,104,0,21101,0,837901247244,1,21102,1,467,0,1106,0,479,21101,0,709488169828,1,21102,1,478,0,1105,1,479,99,109,2,22102,1,-1,1,21102,1,40,2,21101,0,510,3,21102,1,500,0,1105,1,543,109,-2,2106,0,0,0,1,0,0,1,109,2,3,10,204,-1,1001,505,506,521,4,0,1001,505,1,505,108,4,505,10,1006,10,537,1102,1,0,505,109,-2,2106,0,0,0,109,4,2101,0,-1,542,1207,-3,0,10,1006,10,560,21101,0,0,-3,21201,-3,0,1,21202,-2,1,2,21102,1,1,3,21102,1,579,0,1105,1,584,109,-4,2106,0,0,109,5,1207,-3,1,10,1006,10,607,2207,-4,-2,10,1006,10,607,21202,-4,1,-4,1106,0,675,21202,-4,1,1,21201,-3,-1,2,21202,-2,2,3,21101,0,626,0,1106,0,584,22101,0,1,-4,21102,1,1,-1,2207,-4,-2,10,1006,10,645,21102,1,0,-1,22202,-2,-1,-2,2107,0,-3,10,1006,10,667,22101,0,-1,1,21102,1,667,0,105,1,542,21202,-2,-1,-2,22201,-4,-2,-4,109,-5,2105,1,0");
})();