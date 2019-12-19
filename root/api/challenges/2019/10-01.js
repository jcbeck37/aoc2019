function mapAnalyzer() {
  const { buildSpaceMap, plotAsteroids, countVisible, createPatrol, zap } = require("./10.01.utils")();
  const { runTests } = require("./10.01.tests")();
  this.asteroids = [];
  this.patrol = [];

  function processInput(input) {
    // let testResults = runTests();
    // let newStation = testResults[testResults.length - 1].newStation;
    // let finalAsteroid = testResults[testResults.length - 1].finalAsteroid;

    // failures 254 (too low)
    let newStation = runPart1(input);

    let finalAsteroid = runPart2(newStation);

    return {
      part1: newStation,
      part2: finalAsteroid // 915 is too high, 305 is too low
    }
  };

  function runPart1(input) {
    let spaceMap = buildSpaceMap(input);
    this.asteroids = plotAsteroids(spaceMap);

    let results = this.asteroids.map(prospect => countVisible(prospect));
    let bestAsteroid = { los: 0 };
    results.map(res => {
      if (res.los > bestAsteroid.los) {
        bestAsteroid = res;
      }
    });
    // console.log(bestAsteroid);
    return bestAsteroid;
  }

  function runPart2(station) {
    this.asteroids = this.asteroids.filter(a => a !== station);
    this.patrol = createPatrol(station, this.asteroids);

    let result = { zapped: 0, zap200: null };
    let remaining = this.patrol.filter(a => a.zapped === 0).length;
    console.log(`start with ${remaining}`);
    while (remaining > 0) {
      result = zap(90, 0, result);
      result = zap(360, 270, result);
      result = zap(270, 180, result);
      result = zap(180, 90, result);

      remaining = this.patrol.filter(a => a.zapped === 0).length;
      console.log(result.zapped, remaining);
    }

    return result.zap200; //200th
  }

  return {
    processInput
  };
}

module.exports = mapAnalyzer;