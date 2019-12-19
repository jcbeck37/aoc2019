function moonWatching() {
  const fs = require('fs');
  function processInput(input) {

    let energy = runTest1();
    console.log(`Test 1: ${energy}`);

    energy = runTest2();
    console.log(`Test 2: ${energy}`);


    energy = runPart1(input);

    return {
      part1: energy
    };
  }

  function runTest1() {
    let raw = fs.readFileSync('./challenges/2019/tests/2019.12.01', 'utf8');
    //console.log(raw);
    const moons = parseData(raw);
    //console.log(moons);
    const energy = simulateMotion(moons, 10);

    return energy;
  }

  function runTest2() {
    let raw = fs.readFileSync('./challenges/2019/tests/2019.12.02', 'utf8');
    //console.log(raw);
    const moons = parseData(raw);
    //console.log(moons);
    const energy = simulateMotion(moons, 100);

    return energy;
  }

  function runPart1(input) {
    const moons = parseData(input);
    return simulateMotion(moons, 1000);
  }

  const eol = require('os').EOL;
  function parseData(raw) {
    return raw.split(eol).filter(f => f !== '').map(r => {
      //console.log(r);
      return parseMoon(r);
    });
  }

  function parseMoon(raw) {
    // ignore outer brackets and get x, y, z values
    let coords = raw.split(' ');
    // console.log(coords);
    return {
      position: {
        x: splitRawData(coords[0],','),
        y: splitRawData(coords[1],','),
        z: splitRawData(coords[2],'>')
      }, velocity: { x: 0, y: 0, z: 0 }
    };
  }

  function splitRawData(rd, ch) {
    return Number(rd.replace(ch, '').split('=')[1])
  }

  function simulateMotion(moons, steps) {
    let totalEnergy = 0;
    // for each interval
    for (let step = 0; step < steps; step++) {
      // update velocity by applying gravity
      applyGravity(moons);

      // update position by applying velocity
      applyVelocity(moons);

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
        // console.log(acc, itm);
        acc += itm;
        return acc;
      });
    }
    // console.log(totalEnergy);
    return totalEnergy;
  }

  function applyGravity(moons) {
    moons.map((mn, idx) => {
      // console.log(idx, mn);
      moons.filter((c, i) => i !== idx).map(ot => {
        // compare gravity on each axis
        mn.velocity.x = shareGravity(mn.velocity.x, mn.position.x, ot.position.x);
        mn.velocity.y = shareGravity(mn.velocity.y, mn.position.y, ot.position.y);
        mn.velocity.z = shareGravity(mn.velocity.z, mn.position.z, ot.position.z);
      })
    });
  }

  function shareGravity(v, x, y) {
    if (x != y) {
      v += (x < y) ? 1 : -1;
    };
    return v;
  }

  function applyVelocity(moons) {
    moons.map(moon => {
      moon.position.x += moon.velocity.x;
      moon.position.y += moon.velocity.y;
      moon.position.z += moon.velocity.z;
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