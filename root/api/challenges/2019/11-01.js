function hullPaintingRobot() {
  const computer = require('./computer/process');

  function processInput(input) {
    //runTests();
    const results = paintHull(input);
    return results;
  }

  const COLORS = {
    BLACK: 0,
    WHITE: 1
  }
  
  function paintHull(input) {
    let panels = [];
    let position = { x: 0, y: 0, direction: "UP" };

    const robotComputer = new computer('PAINT', input.replace('\n','').split(','));
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
        nextColor = executor.next(currentPanel.color);
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
      painted: panels.length
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