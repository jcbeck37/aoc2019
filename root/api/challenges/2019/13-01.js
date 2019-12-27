function arcadeCabinet() {
  const computer = require('./computer/process');

  function processInput(input) {
    let part1Input = input.replace('\n', '').split(',');
    let result1 = loadCabinet(part1Input);

    // set quarters
    part1Input[0] = 2;
    let part2Input = part1Input;
    let result2 = loadCabinet(part2Input);

    return {
      part1: result1.blockTiles,
      part2: result2.score
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
    let mode = 0;
    let joystickPosition = joystick.neutral;
    //const positions = [1, 1, 0, 0, 0, 1, 1, -1, -1, -1, -1, 0, 0];
    let inputs = 0;
    let score = 0;
    while (!done) {
      if (inputStarted) {
        joystickPosition = calculateBestJoystick(objects);
      }
      let x = executor.next(joystickPosition);
      if (x.value.type === 'INPUT') {
        mode = 1;
        inputStarted = true;
        inputs++;
      } else if (!x.done) {
        mode = 0;
        let y = executor.next();
        let t = executor.next();

        if (x.value.val === -1 && y.value.val === 0) {
          score = t.value.val;
        } else {
          blockTiles += t.value.val === 2 ? 1 : 0;

          let cx = x.value.val;
          let cy = y.value.val;
          let ct = t.value.val;

          let tile = objects.find(o => o.cx === cx && o.cy === cy);
          if (tile !== undefined) {
            tile.ct = ct;
          } else {
            objects.push({ cx, cy, ct });
          }
        }

        done = y.done || t.done;
      }
      done = done || x.done;
      //if (done) {
        //let paddle = objects.find(o => o.ct === 3);
        //let ball = objects.find(o => o.ct === 4);
        //if (paddle !== undefined && ball != undefined) {
          // let js = joystickPosition < 0 ? '<o' : joystickPosition > 0 ? 'o>' : 'o';
          // console.log(`SCORE[${score}] ROUND[${inputs}] ${js}`);
          // drawScreen(objects);
        //}
      //}
    }
    console.log(`SCORE[${score}] ROUND[${inputs}]`);
          drawScreen(objects);
    // console.log(`Block tile count: ${blockTiles}`);
    return {
      blockTiles,
      score
    };
  }

  function calculateBestJoystick(objects) {
    let ball = objects.find(o => o.ct === 4);
    let paddle = objects.find(o => o.ct === 3);
    if (ball !== undefined && paddle !== undefined) {
      if (ball.cx < paddle.cx) {
        return -1;
      } else if (ball.cx > paddle.cx) {
        return 1;
      }
    }
    return 0;
  }

  const object = [' ', '|', '#', '_', 'O'];
  function drawScreen(objects) {
    let xmin = objects.reduce(function (min, obj) { return min > 0 && obj.cx > min ? min : obj.cx; }, 0);
    let xmax = objects.reduce(function (max, obj) { return max > 0 && obj.cx < max ? max : obj.cx; }, 0);
    let ymin = objects.reduce(function (min, obj) { return min > 0 && obj.cy > min ? min : obj.cy; }, 0);
    let ymax = objects.reduce(function (max, obj) { return max > 0 && obj.cy < max ? max : obj.cy; }, 0);

    // only draw after complete rows
    //if (objects.length % ymax === 0) {
    for (let y = ymin; y <= ymax; y++) {
      let line = '';
      for (let x = xmin; x <= xmax; x++) {
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
    //}
  }

  return {
    processInput
  };
}

module.exports = arcadeCabinet;