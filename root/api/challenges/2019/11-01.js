function hullPaintingRobot() {
  const computer = require('./computer/process');

  const COLORS = {
    BLACK: 0,
    WHITE: 1
  }

  function processInput(input) {
    //runTests();
    const part1 = paintHull(input, COLORS.BLACK);
    const part2 = paintHull(input, COLORS.WHITE);
    const ship = examineShip(part2.panels);
    //console.log(part2);
    return {
      part1: part1.panels.length,
      part2: ship
    };
  }

  const paint = [' ', 'X'];
  function examineShip(panels) {
    let ship = '';

    let x0;
    let x1;
    let y0;
    let y1;
    panels.map(p => {
      x0 = getMin(x0, p.x);
      x1 = getMax(x1, p.x);
      y0 = getMin(y0, p.y);
      y1 = getMax(y1, p.y);
    });

    console.log(`(${x0},${y0}) to (${x1},${y1})`);
    for (y = y1; y >= y0; y--) {
      let line = '';
      for (x = x0; x <= x1; x++) {
        let panel = panels.find(p => p.x === x && p.y === y);
        line += panel === undefined ? '.' : paint[panel.color];
      }
      ship += line + require('os').EOL;
      console.log(line);
    }
    return ship;
  }

  function getMin(x, y) {
    if (x === undefined || y < x) {
      return y;
    }
    return x;
  }

  function getMax(x, y) {
    if (x === undefined || y > x) {
      return y;
    }
    return x;
  }

  function paintHull(input, startColor) {
    let init = false;
    let panels = [];
    let position = { x: 0, y: 0, direction: "UP" };

    const robotComputer = new computer('PAINT', input.replace('\n', '').split(','));
    const executor = robotComputer.execute();
    let done = false;
    while (!done) {
      let currentPanel = panels.find(p => p.x === position.x && p.y === position.y);
      if (currentPanel === undefined) {
        currentPanel = { x: position.x, y: position.y, color: COLORS.BLACK };
        panels.push(currentPanel);
      }
      // activate camera
      nextColor = executor.next();
      if (nextColor.value.type === "INPUT") {
        // provide camera results and get paint instruction
        if (init) {
          nextColor = executor.next(currentPanel.color);
        } else {
          nextColor = executor.next(startColor);
          init = true;
        }
      }
      currentPanel.color = nextColor.value.val;

      // get movement instruction
      let turn = executor.next();

      if (!turn.done) {
        position = moveRobot(position, turn.value.val);
      }
      if (nextColor.done || turn.done) {
        done = true;
      }
    }
    return {
      panels
    };
  }

  const directions = ["UP", "RIGHT", "DOWN", "LEFT"];
  function getDirection(position, turn) {
    let direction = position.direction;
    let idx = directions.findIndex(f => f === direction);
    idx = idx + (turn ? 1 : - 1);
    idx = (idx + 4) % 4;
    return directions[idx];
  }

  function moveRobot(position, turn) {
    position.direction = getDirection(position, turn);
    switch (position.direction) {
      case "UP":
        position.y += 1;
        break;
      case "RIGHT":
        position.x += 1;
        break;
      case "DOWN":
        position.y -= 1;
        break;
      case "LEFT":
        position.x -= 1;
        break;
    }
    return position;
  }

  return {
    processInput,
  };
}

module.exports = hullPaintingRobot;