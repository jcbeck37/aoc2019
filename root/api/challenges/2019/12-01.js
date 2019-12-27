function moonWatching() {
  const fs = require('fs');
  function processInput(input) {

    let test1 = runTest1();
    console.log(`Test 1: ${test1.energy} ${test1.steps}`);

    let test2 = runTest2();
    console.log(`Test 2: ${test2.energy} ${test2.steps}`);

    let part1 = runPart1(input);
    let part2 = runPart2(input); // 187590629406 too low
                                 // 400128139852752
    return { part1, part2 };
  }

  function runTest1() {
    let raw = fs.readFileSync('./challenges/2019/tests/2019.12.01', 'utf8');
    const moons = parseData(raw);
    const energy = measureEnergy(moons.slice(), 10);
    const steps = calculateEntropy(moons);

    return { energy, steps };
  }

  function runTest2() {
    let raw = fs.readFileSync('./challenges/2019/tests/2019.12.02', 'utf8');
    const moons = parseData(raw);
    const energy = measureEnergy(moons.slice(), 100);
    const steps = calculateEntropy(moons);

    return { energy, steps };
  }

  function runPart1(input) {
    const moons = parseData(input);
    return measureEnergy(moons, 1000);
  }

  function runPart2(input) {
    const moons = parseData(input);
    return calculateEntropy(moons);
  }

  const eol = require('os').EOL;
  function parseData(raw) {
    return raw.split(eol).filter(f => f !== '').map(r => {
      return parseMoon(r);
    });
  }

  function parseMoon(raw) {
    // ignore outer brackets and get x, y, z values
    let coords = raw.split(' ');
    return {
      position: {
        x: splitRawData(coords[0], ','),
        y: splitRawData(coords[1], ','),
        z: splitRawData(coords[2], '>')
      }, velocity: { x: 0, y: 0, z: 0 }
    };
  }

  function splitRawData(rd, ch) {
    return Number(rd.replace(ch, '').split('=')[1])
  }

  function measureEnergy(moons, steps) {
    let totalEnergy = 0;

    // for each interval
    for (let step = 0; step < steps; step++) {
      simulateMotion(moons, "x");
      simulateMotion(moons, "y");
      simulateMotion(moons, "z");
    }

    // calculate total energy
    let energy = moons.map(moon => {
      // calculate potential energy
      let pot = calculateEnergy(moon.position);
      // calculate kinetic energy
      let kin = calculateEnergy(moon.velocity);
      // multiple
      return pot * kin;
    });

    totalEnergy = energy.reduce((acc, itm) => {
      acc += itm;
      return acc;
    });

    // console.log(totalEnergy);
    return totalEnergy;
  }

  function calculateEntropy(moons) {
    let cycleLengths = ["x", "y", "z"].map(axis => {
      return simulateAxis(moons, axis);
    });

    return leastCommon(cycleLengths);
  }

  function simulateAxis(moons, axis) {
    let simulation = [];
    moons.map(mn => {
      simulation.push({
        position: { ...mn.position },
        velocity: { ...mn.velocity }
      });
    });    

    let cycles = 0;
    let aligned = false;
    while (!aligned) {
      cycles++;
      simulateMotion(simulation, axis);

      let moonsAligned = 0;
      simulation.map((sim, idx) => {
        const { position, velocity } = sim;
        const { position: op, velocity: ov } = moons[idx];

        if (position[axis] === op[axis] && velocity[axis] === ov[axis]) {
          moonsAligned++;
        }

        if (moonsAligned === moons.length) {
          aligned = true;
          // console.log(idx, sim, `axis ${axis} restored after`, cycles, 'cycles');
        }
      });
    }
    return cycles;
  }

  function gcd(a, b) {
    return !b ? a : gcd(b, a % b);
  }

  function lcm(a, b) {
    return (a * b) / gcd(a, b);
  }

  function leastCommon(arr) {
    let multiple = arr[0];
    arr.forEach(function (n) {
      multiple = lcm(multiple, n);
    });
    // console.log('lcm', arr, multiple);
    return multiple;
  }

  function simulateMotion(moons, axis) {
    // update velocity by applying gravity
    applyGravity(moons, axis);

    // update position by applying velocity
    applyVelocity(moons, axis);
  }

  function applyGravity(moons, axis) {
    moons.map((mn, idx) => {
      moons.filter((c, i) => i !== idx).map(ot => {
        // compare gravity on each axis
        mn.velocity[axis] = shareGravity(mn.velocity[axis], mn.position[axis], ot.position[axis]);
      })
    });
  }

  function shareGravity(v, x, y) {
    if (x != y) {
      v += (x < y) ? 1 : -1;
    };
    return v;
  }

  function applyVelocity(moons, axis) {
    moons.map(moon => {
      moon.position[axis] += moon.velocity[axis];
    });
  }

  function calculateEnergy(coordinates) {
    return Math.abs(coordinates.x) + Math.abs(coordinates.y) + Math.abs(coordinates.z);
  }

  return {
    processInput
  };
}

module.exports = moonWatching;