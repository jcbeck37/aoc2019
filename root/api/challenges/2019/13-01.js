function arcadeCabinet() {
  const computer = require('./computer/process');

  function processInput(input) {
    let part1Input = input.replace('\n', '').split(',');
    ///let result1 = loadCabinet(part1Input);

    // set quarters
    part1Input[0] = 2;
    let part2Input = part1Input;
    let result2 = loadCabinet(part2Input);

    return {
      //part1: result1.blockTiles
    };
  }

  const joystick = {
    left: -1,
    neutral: 0,
    right: 1
  };

  //const tiles = ['empty', 'wall', 'block', 'horizontal paddle', 'ball'];
  function loadCabinet(input) {
    const cabinetProgram = new computer('cabinet', input);
    const executor = cabinetProgram.execute();
    let done = false;
    let blockTiles = 0;
    let objects = [];
    let inputStarted = false;
    let joystickPosition = joystick.neutral;
    const positions = [0, 0];
    let inputs = 0;
    while (!done) {
      let x = executor.next();
      if (x.value.type === 'INPUT') {
        //console.log('input');
        if (inputs >= positions.length) inputs = positions.length - 1;

        joystickPosition = positions[inputs];
        executor.next(joystickPosition);
        inputStarted = true;
        inputs++;
      } else if (!x.done) {
        let y = executor.next();
        let t = executor.next();

        if (x.value.val === -1 && y.value.val === 0) {
          // score
          console.log(`New score ${t.value.val}`);
        } else {
          blockTiles += t.value.val === 2 ? 1 : 0;

          let cx = x.value.val;
          let cy = y.value.val;
          let ct = t.value.val;
          //if (ct !== undefined && ct >= 0 && ct < 5) {
            objects.push({ cx, cy, ct });
          //}
        }

        done = y.done || t.done;
      }
      done = done || x.done;
      if (!done && inputStarted) {
        drawScreen(objects);
      }
    }
    // console.log(`Block tile count: ${blockTiles}`);
    return {
      blockTiles
    };
  }

  const object = [' ', '_', '#', '-', 'o'];
  function drawScreen(objects) {
    let xmin = objects.reduce(function (min, obj) { return min > 0 && obj.cx > min ? min : obj.cx; }, 0);
    let xmax = objects.reduce(function (max, obj) { return max > 0 && obj.cx < max ? max : obj.cx; }, 0);
    let ymin = objects.reduce(function (min, obj) { return min > 0 && obj.cy > min ? min : obj.cy; }, 0);
    let ymax = objects.reduce(function (max, obj) { return max > 0 && obj.cy < max ? max : obj.cy; }, 0);

    // only draw after complete rows
    if (objects.length % ymax === 0) {
      for (let x = xmin; x <= xmax; x++) {
        let line = '';
        for (let y = ymin; y <= ymax; y++) {
          let obj = objects.find(o => o.cx === x && o.cy === y);
          if (obj !== undefined) {
            try {
              line += object[obj.ct];
            } catch {
              console.log('Error');
            }
          }
        }
        console.log(line);
      }
    }
  }

  return {
    processInput
  };
}

module.exports = arcadeCabinet;