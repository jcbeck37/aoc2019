function testSuite() {
  const { buildSpaceMap, plotAsteroids, countVisible, createPatrol, zap } = require("./10.01.utils")();
  this.asteroids = [];
  this.patrol = [];

  function runTests() {
    let tests = getTests();
    let results = tests.map(test => {
      this.asteroids = [];
      this.patrol = [];
      let bestAsteroid = runTest1(test);
      console.log(bestAsteroid);
      console.log(`==============`);
      let finalAsteroid = "n/a";
      if (this.asteroids.length > 200) {
        finalAsteroid = runTest2(bestAsteroid);
      }
      let result = {
        newStation: bestAsteroid,
        finalAsteroid
      };
      return result;
    });
    return results;
  }

  function runTest1(test) {
    let graph = test.replace(/\./g, '_');
    console.log('_012345678901234567890123456789'.substr(0, graph.split('\n').length));
    graph.split('\n').map((ln, idx) => {
      console.log(`${idx}${ln}`);
    });

    let spaceMap = buildSpaceMap(test);
    this.asteroids = plotAsteroids(spaceMap);
    // console.log(this.asteroids.filter(f => f.x === 11 && f.y === 12));
    console.log(`==============`);
    let results = this.asteroids.map(prospect => countVisible(prospect));
    let bestAsteroid = { los: 0 };
    results.map(res => {
      if (res.los > bestAsteroid.los) {
        bestAsteroid = res;
      }
    });
    return bestAsteroid;
  }

  function runTest2(station) {
    this.asteroids = this.asteroids.filter(a => a.x !== station.x || a.y !== station.y);
    this.patrol = createPatrol(station, this.asteroids);

    let result = { zapped: 0, zap200: null };
    let remaining = this.patrol.filter(a => a.zapped === 0).length;
    while (remaining > 0) {
      result = zap(90, 0, result, true);
      result = zap(360, 270, result, true);
      result = zap(270, 180, result, true);
      result = zap(180, 90, result, true);

      remaining = this.patrol.filter(a => a.zapped === 0).length;
    }

    return result.zap200;
  }

  function getTests() {
    let tests = [];

    // 3,4 with 8
    let test1 = '.#..#\n';
    test1 += '.....\n';
    test1 += '#####\n';
    test1 += '....#\n';
    test1 += '...##\n';
    //tests.push(test1);

    // 5,8 with 33
    test1 = '......#.#.\n';
    test1 += '#..#.#....\n';
    test1 += '..#######.\n';
    test1 += '.#.#.###..\n';
    test1 += '.#..#.....\n';
    test1 += '..#....#.#\n';
    test1 += '#..#....#.\n';
    test1 += '.##.#..###\n';
    test1 += '##...#..#.\n';
    test1 += '.#....####';
    //tests.push(test1);

    // 11,13 with 210 
    //     x  01234567890123456789
    test1  = '.#..##.###...#######\n'; // y = 0
    test1 += '##.############..##.\n'; // y = 1
    test1 += '.#.######.########.#\n'; // y = 2
    test1 += '.###.#######.####.#.\n';
    test1 += '#####.##.#.##.###.##\n';
    test1 += '..#####..#.#########\n';
    test1 += '####################\n';
    test1 += '#.####....###.#.#.##\n';
    test1 += '##.#################\n';
    test1 += '#####.##.###..####..\n';
    test1 += '..######..##.#######\n';
    test1 += '####.##.####...##..#\n';
    test1 += '.#####..#.######.###\n';
    test1 += '##...#.##########...\n';
    test1 += '#.##########.#######\n';
    test1 += '.####.#.###.###.#.##\n';
    test1 += '....##.##.###..#####\n';
    test1 += '.#.#.###########.###\n';
    test1 += '#.#.#.#####.####.###\n';
    test1 += '###.##.####.##.#..##';
    tests.push(test1);

    return tests;
  }

  return {
    runTests
  };
}

module.exports = testSuite;